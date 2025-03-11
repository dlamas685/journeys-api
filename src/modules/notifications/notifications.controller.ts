import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import { ApiOkResponsePaginated, UserId } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { MarkAsReadDto, NotificationQueryParamsDto } from './dtos'
import { CreateNotificationDto } from './dtos/create-notification.dto'
import { NotificationEntity } from './entities/notification.entity'
import { NotificationsService } from './notifications.service'

@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de Notificación',
		description: 'Endpoint con fines de pruebas.',
	})
	@ApiOkResponse({ type: NotificationEntity })
	create(@Body() createNotificationDto: CreateNotificationDto) {
		return this.notificationsService.create(createNotificationDto)
	}

	@Get()
	@ApiOperation({
		summary: 'Listado de Notificaciones',
		description: 'Permite recuperar de forma paginada las notificaciones.',
	})
	@ApiOkResponsePaginated(NotificationEntity)
	findAll(
		@UserId() recipientId: string,
		@Query() queryParamsDto: NotificationQueryParamsDto
	) {
		return this.notificationsService.findAll(recipientId, queryParamsDto)
	}

	@Post('read')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Marca una o varias notificaciones como leída',
	})
	markAsRead(
		@UserId() recipientId: string,
		@Body() markAsReadDto: MarkAsReadDto
	) {
		return this.notificationsService.markAsRead(recipientId, markAsReadDto)
	}

	@Delete(':id')
	remove(
		@UserId() recipientId: string,
		@Param('id', ParseUUIDPipe) id: string
	) {
		return this.notificationsService.remove(recipientId, id)
	}
}
