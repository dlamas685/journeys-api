import { Injectable } from '@nestjs/common'
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

	async findAll(queryParamsDto: QueryParamsDto) {
		const { page, limit, filters, sorts, logicalFilters } = queryParamsDto

		const parseFilters = filters ? fromFiltersToWhere(filters) : {}

		const parseLogical = logicalFilters
			? fromLogicalFiltersToWhere(logicalFilters)
			: {}

		const parseSorts = sorts ? fromSortsToOrderby(sorts) : {}

		return await this.prisma.activityTemplate.findMany({
			where: {
				...parseFilters,
				...parseLogical,
			},
			orderBy: {
				...parseSorts,
			},
			skip: (page - 1) * limit,
			take: limit,
		})
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
