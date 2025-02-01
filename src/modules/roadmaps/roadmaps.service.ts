import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities/paginated-response.entity'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { PrismaService } from '../prisma/prisma.service'
import { ChangeRoadmapStatusDto } from './dto'
import { CreateRoadmapDto } from './dto/create-roadmap.dto'
import { RoadmapQueryParamsDto } from './dto/roadmap-params.dto'
import { UpdateRoadmapDto } from './dto/update-roadmap.dto'
import { RoadmapEntity } from './entities/roadmap.entity'

@Injectable()
export class RoadmapsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		userId: string,
		createRoadmapDto: CreateRoadmapDto
	): Promise<RoadmapEntity> {
		const newRoadmap = await this.prisma.roadmap.create({
			data: {
				userId,
				...createRoadmapDto,
			},
		})

		return new RoadmapEntity(newRoadmap)
	}

	async findAll(
		userId: string,
		queryParamsDto: RoadmapQueryParamsDto
	): Promise<PaginatedResponseEntity<RoadmapEntity>> {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.RoadmapFindManyArgs = {
			where: {
				userId,
				...parsedFilters,
				...parsedLogicalFilters,
			},
			orderBy: {
				...parsedSorts,
			},
			skip:
				queryParamsDto.page && queryParamsDto.limit
					? (queryParamsDto.page - 1) * queryParamsDto.limit
					: undefined,
			take: queryParamsDto.limit,
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.roadmap.findMany(query),
			this.prisma.roadmap.count({ where: query.where }),
		])

		const roadmaps = records.map(record => new RoadmapEntity(record))

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return plainToInstance(PaginatedResponseEntity, {
			data: roadmaps,
			meta: metadata,
		})
	}

	async findOne(userId: string, id: string): Promise<RoadmapEntity> {
		const foundRoadmap = await this.prisma.roadmap.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundRoadmap) {
			throw new NotFoundException('Viaje no encontrado')
		}

		return new RoadmapEntity(foundRoadmap)
	}

	async update(
		userId: string,
		id: string,
		updateRoadmapDto: UpdateRoadmapDto
	): Promise<RoadmapEntity> {
		const updatedRoadmap = await this.prisma.roadmap.update({
			where: {
				userId,
				id,
			},
			data: {
				...updateRoadmapDto,
			},
		})

		return new RoadmapEntity(updatedRoadmap)
	}

	async remove(userId: string, id: string): Promise<string> {
		await this.prisma.roadmap.delete({
			where: {
				userId,
				id,
			},
		})

		return `Eliminación completa!`
	}

	async changeStatus(
		userId: string,
		changeRoadmapStatusDto: ChangeRoadmapStatusDto
	): Promise<RoadmapEntity> {
		const changedRoadmapStatus = await this.prisma.roadmap.update({
			where: {
				userId,
				id: changeRoadmapStatusDto.id,
			},
			data: {
				status: changeRoadmapStatusDto.status,
			},
		})

		return new RoadmapEntity(changedRoadmapStatus)
	}
}
