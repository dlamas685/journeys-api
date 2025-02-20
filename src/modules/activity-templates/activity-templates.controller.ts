import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiExcludeEndpoint,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import { ApiOkResponsePaginated, UserId } from '../../common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ActivityTemplatesService } from './activity-templates.service'
import {
	ActivityTemplatesQueryParamsDto,
	CreateActivityDto,
	CreateActivityTemplateDto,
	UpdateActivityDto,
	UpdateActivityTemplateDto,
} from './dtos'
import { ActivityTemplateEntity } from './entities/activity-template.entity'

@Controller('activity-templates')
@UseGuards(JwtAuthGuard)
@ApiTags('Activity Templates')
@ApiBearerAuth('JWT-auth')
export class ActivityTemplatesController {
	constructor(
		private readonly activityTemplatesService: ActivityTemplatesService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de plantilla de actividades',
		description: 'Permite crear una nueva plantilla de actividades.',
	})
	@ApiOkResponse({ type: ActivityTemplateEntity })
	create(
		@UserId() userId: string,
		@Body() createActivityTemplateDto: CreateActivityTemplateDto
	) {
		return this.activityTemplatesService.create(
			userId,
			createActivityTemplateDto
		)
	}

	@Get()
	@ApiOperation({
		summary: 'Listado de plantillas de actividades',
		description:
			'Permite recuperar de forma paginada las plantillas de actividades.',
	})
	@ApiOkResponsePaginated(ActivityTemplateEntity)
	findAll(
		@UserId() userId: string,
		@Query() queryParamsDto: ActivityTemplatesQueryParamsDto
	) {
		return this.activityTemplatesService.findAll(userId, queryParamsDto)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Búsqueda de plantilla de actividades',
		description: 'Permite buscar una plantilla de actividades por su ID.',
	})
	@ApiOkResponse({ type: ActivityTemplateEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.activityTemplatesService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualización de plantilla de actividades',
		description:
			'Permite actualizar los datos de una plantilla de actividades.',
	})
	@ApiOkResponse({ type: ActivityTemplateEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateActivityTemplateDto: UpdateActivityTemplateDto
	) {
		return this.activityTemplatesService.update(
			userId,
			id,
			updateActivityTemplateDto
		)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Eliminación de plantilla de actividades',
		description: 'Permite eliminar una plantilla de actividades por su ID.',
	})
	@ApiOkResponse({ type: String })
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.activityTemplatesService.remove(userId, id)
	}

	@Post(':id/activities')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de actividades en plantilla',
		description: 'Permite crear una nueva actividad en una plantilla.',
	})
	@ApiOkResponse({ type: ActivityTemplateEntity })
	createActivity(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() createActivityDto: CreateActivityDto
	) {
		return this.activityTemplatesService.createActivity(
			userId,
			id,
			createActivityDto
		)
	}

	@Patch(':id/activities/:activityId')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualización de actividad en plantilla',
		description:
			'Permite actualizar los datos de una actividad en una plantilla.',
	})
	@ApiExcludeEndpoint()
	@ApiOkResponse({ type: ActivityTemplateEntity })
	updateActivity(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Param('activityId', ParseUUIDPipe) activityId: string,
		@Body() updateActivityDto: UpdateActivityDto
	) {
		return this.activityTemplatesService.updateActivity(
			userId,
			id,
			activityId,
			updateActivityDto
		)
	}

	@Delete(':id/activities/:activityId')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Eliminación de actividad en plantilla',
		description: 'Permite eliminar una actividad en una plantilla por su ID.',
	})
	@ApiOkResponse({ type: String })
	removeActivity(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Param('activityId', ParseUUIDPipe) activityId: string
	) {
		return this.activityTemplatesService.removeActivity(userId, id, activityId)
	}
}
