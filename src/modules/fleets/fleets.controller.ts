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
import { DriverQueryParamsDto } from '../drivers/dto'
import { DriverEntity } from '../drivers/entities/driver.entity'
import { VehicleQueryParamsDto } from '../vehicles/dto'
import { VehicleEntity } from '../vehicles/entities/vehicle.entity'
import { CreateFleetDto, FleetQueryParamsDto, UpdateFleetDto } from './dto'
import { FleetEntity } from './entities/fleet.entity'
import { FleetsService } from './fleets.service'

@Controller('fleets')
@UseGuards(JwtAuthGuard)
@ApiTags('Fleets')
@ApiBearerAuth('JWT-auth')
export class FleetsController {
	constructor(private readonly fleetsService: FleetsService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de flota',
		description: 'Permite crear una flota.',
	})
	@ApiOkResponse({ type: FleetEntity })
	create(@UserId() userId: string, @Body() createFleetDto: CreateFleetDto) {
		return this.fleetsService.create(userId, createFleetDto)
	}

	@Get()
	@ApiOperation({
		summary: 'Listado de flotas',
		description: 'Permite recuperar de forma paginada las flotas.',
	})
	@ApiOkResponsePaginated(FleetEntity)
	findAll(
		@UserId() userId: string,
		@Query() queryParamsDto: FleetQueryParamsDto
	) {
		return this.fleetsService.findAll(userId, queryParamsDto)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Búsqueda de flota',
		description: 'Permite buscar una flota por su ID.',
	})
	@ApiOkResponse({ type: FleetEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.fleetsService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualización de flota',
		description: 'Permite actualizar los datos de una flota.',
	})
	@ApiOkResponse({ type: FleetEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateFleetDto: UpdateFleetDto
	) {
		return this.fleetsService.update(userId, id, updateFleetDto)
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Eliminación de flota',
		description: 'Permite eliminar una flota por su ID.',
	})
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.fleetsService.remove(userId, id)
	}

	@Get(':id/vehicles')
	@ApiOperation({
		summary: 'Listado de vehículos de una flota',
		description:
			'Permite recuperar de forma paginada los vehículos de una flota.',
	})
	@ApiOkResponsePaginated(VehicleEntity)
	findVehicles(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Query() queryParamsDto: VehicleQueryParamsDto
	) {
		return this.fleetsService.findVehicles(userId, id, queryParamsDto)
	}

	@Get(':id/drivers')
	@ApiOperation({
		summary: 'Listado de conductores de una flota',
		description:
			'Permite recuperar de forma paginada los conductores de una flota.',
	})
	@ApiOkResponsePaginated(DriverEntity)
	findDrivers(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Query() queryParamsDto: DriverQueryParamsDto
	) {
		return this.fleetsService.findDrivers(userId, id, queryParamsDto)
	}
}
