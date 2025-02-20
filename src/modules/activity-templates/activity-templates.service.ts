import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities'
import { v4 as uuid } from 'uuid'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from '../../common/helpers'
import { PrismaService } from '../prisma/prisma.service'
import {
	ActivityTemplatesQueryParamsDto,
	CreateActivityDto,
	CreateActivityTemplateDto,
	UpdateActivityDto,
	UpdateActivityTemplateDto,
} from './dtos'
import { ActivityTemplateEntity } from './entities/activity-template.entity'
@Injectable()
export class ActivityTemplatesService {
	constructor(
		private readonly prisma: PrismaService,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
	) {}

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

	async findAll(
		userId: string,
		queryParamsDto: ActivityTemplatesQueryParamsDto
	) {
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
			skip:
				queryParamsDto.page && queryParamsDto.limit
					? (queryParamsDto.page - 1) * queryParamsDto.limit
					: undefined,
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
		const activitiesTemplate = await this.prisma.activityTemplate.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!activitiesTemplate) {
			throw new NotFoundException('Plantilla de actividades no encontrada')
		}

		return new ActivityTemplateEntity(activitiesTemplate)
	}

	async update(
		userId: string,
		id: string,
		updateActivityTemplateDto: UpdateActivityTemplateDto
	): Promise<ActivityTemplateEntity> {
		const updatedActivitiesTemplate = await this.prisma.activityTemplate.update(
			{
				where: {
					id,
					userId,
				},
				data: {
					...updateActivityTemplateDto,
				},
			}
		)

		return new ActivityTemplateEntity(updatedActivitiesTemplate)
	}

	async remove(userId: string, id: string) {
		await this.prisma.activityTemplate.delete({
			where: { id, userId },
		})

		return `Eliminación Completa!`
	}

	async createActivity(
		userId: string,
		id: string,
		createActivityDto: CreateActivityDto
	): Promise<ActivityTemplateEntity> {
		const activityTemplate = await this.findOne(userId, id)

		const newCreateActivityDto = { ...createActivityDto, id: uuid() }

		const activities = [
			...((activityTemplate.activities as any[]) ?? []),
			newCreateActivityDto,
		]

		const updatedActivities = await this.update(userId, id, {
			activities,
		})

		return new ActivityTemplateEntity(updatedActivities)
	}

	async updateActivity(
		userId: string,
		id: string,
		activityId: string,
		updateActivityDto: UpdateActivityDto
	): Promise<ActivityTemplateEntity> {
		const activityTemplate = await this.findOne(userId, id)

		const activity = (activityTemplate.activities as any[]).find(
			activity => activity.id === activityId
		)

		if (!activity) {
			throw new NotFoundException('Actividad no encontrada')
		}

		const activities = (activityTemplate.activities as any[]).map(activity =>
			activity.id === activityId
				? { ...activity, ...updateActivityDto }
				: activity
		)

		const updatedActivities = await this.prisma.activityTemplate.update({
			where: {
				id,
			},
			data: {
				activities,
			},
		})

		return new ActivityTemplateEntity(updatedActivities)
	}

	async removeActivity(userId: string, id: string, activityId: string) {
		const activityTemplate = await this.findOne(userId, id)

		const activity = (activityTemplate.activities as any[]).find(
			activity => activity.id === activityId
		)

		if (!activity) {
			throw new NotFoundException('Actividad no encontrada')
		}

		const activities = (activityTemplate.activities as any[]).filter(
			activity => activity.id !== activityId
		)

		const updatedActivities = await this.prisma.activityTemplate.update({
			where: {
				id,
			},
			data: {
				activities,
			},
		})

		return new ActivityTemplateEntity(updatedActivities)
	}
}
