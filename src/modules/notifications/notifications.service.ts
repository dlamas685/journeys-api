import { Injectable } from '@nestjs/common'
import { NotificationType, Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { PrismaService } from '../prisma/prisma.service'
import { WEBSOCKET_EVENTS } from './constants/websocket-events.constants'
import { MarkAsReadDto, NotificationQueryParamsDto } from './dtos'
import { CreateNotificationDto } from './dtos/create-notification.dto'
import { NotificationEntity } from './entities/notification.entity'
import { NotificationsGateway } from './notifications.gateway'

@Injectable()
export class NotificationsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly websocket: NotificationsGateway
	) {}

	async create(
		createNotificationDto: CreateNotificationDto
	): Promise<NotificationEntity> {
		const createdNotification = await this.prisma.notification.create({
			data: {
				...createNotificationDto,
			},
		})

		this.websocket.server
			.to(createdNotification.recipientId)
			.emit(WEBSOCKET_EVENTS.NEW_NOTIFICATION, createdNotification)

		return plainToInstance(NotificationEntity, createdNotification)
	}

	async findAll(
		recipientId: string,
		queryParamsDto: NotificationQueryParamsDto
	): Promise<PaginatedResponseEntity<NotificationEntity>> {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.NotificationFindManyArgs = {
			where: {
				recipientId,
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
			this.prisma.notification.findMany(query),
			this.prisma.notification.count({ where: query.where }),
		])

		const notifications = plainToInstance(NotificationEntity, records)

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return plainToInstance(PaginatedResponseEntity, {
			data: notifications,
			meta: metadata,
		})
	}

	async markAsRead(recipientId: string, markAsReadDto: MarkAsReadDto) {
		return await this.prisma.notification.updateMany({
			where: {
				recipientId,
				readAt: null,
				...(!markAsReadDto.markAll && { id: { in: markAsReadDto.ids } }),
			},
			data: {
				readAt: new Date().toISOString(),
			},
		})
	}

	async remove(recipientId: string, id: string) {
		await this.prisma.notification.delete({
			where: { id, recipientId },
		})

		return `Eliminación completa!`
	}

	sendTrip(recipientId: string, message?: string) {
		const notification: CreateNotificationDto = {
			recipientId,
			type: NotificationType.TRIPS,
			subject: 'Viajes',
			message,
		}

		return this.create(notification)
	}

	sendRoadmap(recipientId: string, message?: string) {
		const notification: CreateNotificationDto = {
			recipientId,
			type: NotificationType.ROADMAPS,
			subject: 'Hojas de Ruta',
			message,
		}

		return this.create(notification)
	}

	sendOptimization(recipientId: string, message?: string) {
		const notification: CreateNotificationDto = {
			recipientId,
			type: NotificationType.OPTIMIZATION,
			subject: 'Optimización',
			message,
		}

		return this.create(notification)
	}
}
