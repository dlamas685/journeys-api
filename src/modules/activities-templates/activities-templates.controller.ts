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
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import { ApiOkResponsePaginated, UserId } from '../../common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ActivitiesTemplatesService } from './activities-templates.service'
import { ActivitiesTemplatesQueryParamsDto } from './dto/activities-templates-params.dto'
import { CreateActivitiesTemplateDto } from './dto/create-activities-template.dto'
import { UpdateActivitiesTemplateDto } from './dto/update-activities-template.dto'
import { ActivitiesTemplateEntity } from './entities/activities-template.entity'

@Controller('activities-templates')
@UseGuards(JwtAuthGuard)
@ApiTags('Activities Templates')
@ApiBearerAuth('JWT-auth')
export class ActivitiesTemplatesController {
	constructor(
		private readonly activityTemplatesService: ActivitiesTemplatesService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de plantilla de actividades',
		description: 'Permite crear una nueva plantilla de actividades.',
	})
	@ApiOkResponse({ type: ActivitiesTemplateEntity })
	create(
		@UserId() userId: string,
		@Body() createActivityTemplateDto: CreateActivitiesTemplateDto
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
	@ApiOkResponsePaginated(ActivitiesTemplateEntity)
	findAll(
		@UserId() userId: string,
		@Query() queryParamsDto: ActivitiesTemplatesQueryParamsDto
	) {
		return this.activityTemplatesService.findAll(userId, queryParamsDto)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Búsqueda de plantilla de actividades',
		description: 'Permite buscar una plantilla de actividades por su ID.',
	})
	@ApiOkResponse({ type: ActivitiesTemplateEntity })
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
	@ApiOkResponse({ type: ActivitiesTemplateEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateActivityTemplateDto: UpdateActivitiesTemplateDto
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
}
