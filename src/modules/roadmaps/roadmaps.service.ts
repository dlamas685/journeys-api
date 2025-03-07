import { InjectQueue } from '@nestjs/bullmq'
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma, RoadmapStatus } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'
import { Queue } from 'bullmq'
import { plainToInstance } from 'class-transformer'
import { QUEUE_NAMES, QUEUE_TASK_NAME } from 'src/common/constants'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { OptimizationService } from '../optimization/optimization.service'
import { SettingDto } from '../optimization/routes-optimization/dtos'
import { PrismaService } from '../prisma/prisma.service'
import { VALID_TRANSITIONS } from './constants/valid-transitions.constants'
import { CreateRoadmapDto } from './dtos/create-roadmap.dto'
import { RoadmapQueryParamsDto } from './dtos/roadmap-params.dto'
import { UpdateRoadmapDto } from './dtos/update-roadmap.dto'
import { RoadmapEntity } from './entities/roadmap.entity'

@Injectable()
export class RoadmapsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly optimization: OptimizationService,
		@InjectQueue(QUEUE_NAMES.ROADMAPS) private queue: Queue
	) {}

	async create(
		userId: string,
		createRoadmapDto: CreateRoadmapDto
	): Promise<RoadmapEntity> {
		return this.prisma.$transaction(async prisma => {
			const createdRoadmap = await prisma.roadmap.create({
				data: {
					userId,
					...createRoadmapDto,
				},
			})

			const setting = plainToInstance(SettingDto, createdRoadmap.setting)

			const startDateTime = new Date(setting.firstStage.startDateTime)

			const scheduledTime = startDateTime.getTime() - 600000

			await this.queue.add(QUEUE_TASK_NAME.ROADMAPS.OPTIMIZE, createdRoadmap, {
				delay: Math.max(0, scheduledTime - Date.now()),
				attempts: 5,
				backoff: { type: 'exponential', delay: 5000 },
			})

			return new RoadmapEntity({
				...createdRoadmap,
				setting: createRoadmapDto.setting as JsonObject,
				results: null,
			})
		})
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
			include: {
				driver: true,
				fleet: true,
				vehicle: true,
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

		const roadmaps = records.map(
			record =>
				new RoadmapEntity({
					...record,
					setting: record.setting as JsonObject,
					results: record.results as JsonObject,
				})
		)

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

		if (!foundRoadmap.results) {
			const setting = plainToInstance(SettingDto, foundRoadmap.setting)

			const results = await this.optimization.optimizeTours(userId, setting)

			return new RoadmapEntity({
				...foundRoadmap,
				setting: foundRoadmap.setting as JsonObject,
				results: results as unknown as JsonObject,
			})
		}

		return new RoadmapEntity({
			...foundRoadmap,
			setting: foundRoadmap.setting as JsonObject,
			results: foundRoadmap.results as JsonObject,
		})
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

		return new RoadmapEntity({
			...updatedRoadmap,
			setting: updatedRoadmap.setting as JsonObject,
			results: updatedRoadmap.results as JsonObject,
		})
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
		id: string,
		newStatus: RoadmapStatus
	): Promise<RoadmapEntity> {
		const foundRoadmap = await this.prisma.roadmap.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundRoadmap) {
			throw new NotFoundException('Viaje no encontrado')
		}

		if (!VALID_TRANSITIONS[foundRoadmap.status].includes(newStatus)) {
			throw new BadRequestException('Transición de estado no válida')
		}

		const updatedRoadmap = await this.prisma.roadmap.update({
			where: {
				id,
				userId,
			},
			data: {
				status: newStatus,
			},
		})

		return new RoadmapEntity({
			...updatedRoadmap,
			setting: updatedRoadmap.setting as JsonObject,
			results: updatedRoadmap.results as JsonObject,
		})
	}

	async setResults(
		userId: string,
		id: string,
		results: JsonObject
	): Promise<RoadmapEntity> {
		const updatedRoadmap = await this.prisma.roadmap.update({
			where: {
				userId,
				id,
			},
			data: {
				results,
			},
		})

		return new RoadmapEntity({
			...updatedRoadmap,
			setting: updatedRoadmap.setting as JsonObject,
			results: updatedRoadmap.results as JsonObject,
		})
	}
}
