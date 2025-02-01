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
import { ApiOkResponsePaginated, UserId } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import {
	ChangeRoadmapStatusDto,
	CreateRoadmapDto,
	UpdateRoadmapDto,
} from './dto'
import { RoadmapQueryParamsDto } from './dto/roadmap-params.dto'
import { RoadmapEntity } from './entities/roadmap.entity'
import { RoadmapsService } from './roadmaps.service'

@Controller('roadmaps')
@UseGuards(JwtAuthGuard)
@ApiTags('Roadmaps')
@ApiBearerAuth('JWT-auth')
export class RoadmapsController {
	constructor(private readonly roadmapsService: RoadmapsService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de Viaje para empresa',
		description: 'Permite crear un nuevo viaje para empresa.',
	})
	@ApiOkResponse({ type: RoadmapEntity })
	create(@UserId() userId: string, @Body() createRoadmapDto: CreateRoadmapDto) {
		return this.roadmapsService.create(userId, createRoadmapDto)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Listado de viajes',
		description: 'Permite recuperar de forma paginada los viajes.',
	})
	@ApiOkResponsePaginated(RoadmapEntity)
	findAll(
		@UserId() userId: string,
		@Query() queryParamsDto: RoadmapQueryParamsDto
	) {
		return this.roadmapsService.findAll(userId, queryParamsDto)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Búsqueda de viaje',
		description: 'Permite buscar un viaje por su ID.',
	})
	@ApiOkResponse({ type: RoadmapEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.roadmapsService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualización de viaje',
		description: 'Permite actualizar el viaje.',
	})
	@ApiOkResponse({ type: RoadmapEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateRoadmapDto: UpdateRoadmapDto
	) {
		return this.roadmapsService.update(userId, id, updateRoadmapDto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Eliminación de viaje',
		description: 'Permite eliminar un viaje.',
	})
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.roadmapsService.remove(userId, id)
	}

	@Post('change-status')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Cambia el estado de un viaje',
	})
	@ApiOkResponse({ type: RoadmapEntity })
	changeStatus(
		@UserId() userId: string,
		@Body() changeRoadmapStatusDto: ChangeRoadmapStatusDto
	) {
		return this.roadmapsService.changeStatus(userId, changeRoadmapStatusDto)
	}
}
