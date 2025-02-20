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
import { CreateTripDto, UpdateTripDto } from './dtos'
import { TripQueryParamsDto } from './dtos/trip-params.dto'
import { TripEntity } from './entities/trip.entity'
import { TripsService } from './trips.service'

@Controller('trips')
@UseGuards(JwtAuthGuard)
@ApiTags('Trips')
@ApiBearerAuth('JWT-auth')
export class TripsController {
	constructor(private readonly tripsService: TripsService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de Viaje',
		description: 'Permite crear un nuevo viaje.',
	})
	@ApiOkResponse({ type: TripEntity })
	create(@UserId() userId: string, @Body() createTripDto: CreateTripDto) {
		return this.tripsService.create(userId, createTripDto)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Listado de viajes',
		description: 'Permite recuperar de forma paginada los viajes.',
	})
	@ApiOkResponsePaginated(TripEntity)
	findAll(
		@UserId() userId: string,
		@Query() queryParamsDto: TripQueryParamsDto
	) {
		return this.tripsService.findAll(userId, queryParamsDto)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Búsqueda de viaje',
		description: 'Permite buscar un viaje por su ID.',
	})
	@ApiOkResponse({ type: TripEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.tripsService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualización de viaje',
		description: 'Permite actualizar el viaje.',
	})
	@ApiOkResponse({ type: TripEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateTripDto: UpdateTripDto
	) {
		return this.tripsService.update(userId, id, updateTripDto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Eliminación de viaje',
		description: 'Permite eliminar un viaje.',
	})
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.tripsService.remove(userId, id)
	}
}
