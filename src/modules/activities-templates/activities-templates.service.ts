import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities/paginated-response.entity'
import { QueryParamsDto } from '../../common/dto'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from '../../common/helpers'
import { PrismaService } from '../prisma/prisma.service'
import { CreateActivitiesTemplateDto } from './dto/create-activities-template.dto'
import { UpdateActivitiesTemplateDto } from './dto/update-activities-template.dto'
import { ActivitiesTemplateEntity } from './entities/activities-template.entity'

@Injectable()
export class ActivitiesTemplatesService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		userId: string,
		createActivityTemplateDto: CreateActivitiesTemplateDto
	): Promise<ActivitiesTemplateEntity> {
		const newFavoriteAddress = await this.prisma.activitiesTemplate.create({
			data: {
				userId,
				...createActivityTemplateDto,
			},
		})

		return new ActivitiesTemplateEntity(newFavoriteAddress)
	}

	async findAll(userId: string, queryParamsDto: QueryParamsDto) {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)
		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)
		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.ActivitiesTemplateFindManyArgs = {
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
			this.prisma.activitiesTemplate.findMany(query),
			this.prisma.activitiesTemplate.count({ where: query.where }),
		])

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return new PaginatedResponseEntity<ActivitiesTemplateEntity>(
			plainToInstance(ActivitiesTemplateEntity, records),
			metadata
		)
	}

	async findOne(userId: string, id: string) {
		const activitiesTemplate = await this.prisma.activitiesTemplate.findFirst({
			where: {
				id,
				userId,
			},
		})

		return new ActivitiesTemplateEntity(activitiesTemplate)
	}

	async update(
		userId: string,
		id: string,
		updateActivityTemplateDto: UpdateActivitiesTemplateDto
	): Promise<ActivitiesTemplateEntity> {
		const updatedActivitiesTemplate =
			await this.prisma.activitiesTemplate.update({
				where: {
					id,
					userId,
				},
				data: {
					...updateActivityTemplateDto,
				},
			})

		return new ActivitiesTemplateEntity(updatedActivitiesTemplate)
	}

	async remove(userId: string, id: string) {
		await this.prisma.activitiesTemplate.delete({
			where: { id, userId },
		})

		return `Eliminación Completa!`
	}
}
