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
import { CreateActivityTemplateDto } from './dto/create-activity-template.dto'
import { UpdateActivityTemplateDto } from './dto/update-activity-template.dto'
import { ActivityTemplateEntity } from './entities/activity-template.entity'

@Injectable()
export class ActivityTemplatesService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		userId: string,
		createActivityTemplateDto: CreateActivityTemplateDto
	): Promise<ActivityTemplateEntity> {
		const newFavoriteAddress = await this.prisma.activityTemplate.create({
			data: {
				userId,
				...createActivityTemplateDto,
			},
		})

		return new ActivityTemplateEntity(newFavoriteAddress)
	}

	async findAll(userId: string, queryParamsDto: QueryParamsDto) {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)
		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)
		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.ActivityTemplateFindManyArgs = {
			where: {
				userId,
				...parsedFilters,
				...parsedLogicalFilters,
			},
			orderBy: {
				...parsedSorts,
			},
			skip: (queryParamsDto.page - 1) * queryParamsDto.limit,
			take: queryParamsDto.limit,
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.activityTemplate.findMany(query),
			this.prisma.activityTemplate.count({ where: query.where }),
		])

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return new PaginatedResponseEntity<ActivityTemplateEntity>(
			plainToInstance(ActivityTemplateEntity, records),
			metadata
		)
	}

	async findOne(userId: string, id: string) {
		const foundActivityTemplate = await this.prisma.activityTemplate.findFirst({
			where: {
				id,
				userId,
			},
		})

		return new ActivityTemplateEntity(foundActivityTemplate)
	}

	async update(
		userId: string,
		id: string,
		updateActivityTemplateDto: UpdateActivityTemplateDto
	): Promise<ActivityTemplateEntity> {
		const updatedActivityTemplate = await this.prisma.activityTemplate.update({
			where: {
				id,
				userId,
			},
			data: {
				...updateActivityTemplateDto,
			},
		})

		return new ActivityTemplateEntity(updatedActivityTemplate)
	}

	async remove(userId: string, id: string) {
		await this.prisma.activityTemplate.delete({
			where: { id, userId },
		})

		return `Eliminación Completa!`
	}
}
