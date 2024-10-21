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
import { ActivityTemplatesService } from './activity-templates.service'
import { ActivityTemplateQueryParamsDto } from './dto/activity-template-params.dto'
import { CreateActivityTemplateDto } from './dto/create-activity-template.dto'
import { UpdateActivityTemplateDto } from './dto/update-activity-template.dto'
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
		summary: 'Listar plantillas de actividades del usuario',
	})
	@ApiOkResponsePaginated(ActivityTemplateEntity)
	findAll(
		@UserId() userId: string,
		@Query() queryParamsDto: ActivityTemplateQueryParamsDto
	) {
		return this.activityTemplatesService.findAll(userId, queryParamsDto)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: ActivityTemplateEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.activityTemplatesService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
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
	@ApiOkResponse({ type: String })
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.activityTemplatesService.remove(userId, id)
	}
}
