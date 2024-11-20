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
import { VehicleQueryParamsDto } from './dto'
import { CreateVehicleDto } from './dto/create-vehicle.dto'
import { UpdateVehicleDto } from './dto/update-vehicle.dto'
import { VehicleEntity } from './entities/vehicle.entity'
import { VehiclesService } from './vehicles.service'

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
@ApiTags('Vehicles')
@ApiBearerAuth('JWT-auth')
export class VehiclesController {
	constructor(private readonly vehiclesService: VehiclesService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de vehículo',
		description: 'Permite crear un nuevo vehículo.',
	})
	@ApiOkResponse({ type: VehicleEntity })
	create(@UserId() userId: string, @Body() createVehicleDto: CreateVehicleDto) {
		return this.vehiclesService.create(userId, createVehicleDto)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Listado de vehículos',
		description: 'Permite recuperar de forma paginada los vehículos.',
	})
	@ApiOkResponsePaginated(VehicleEntity)
	findAll(
		@UserId() userId: string,
		@Query() queryParamsDto: VehicleQueryParamsDto
	) {
		return this.vehiclesService.findAll(userId, queryParamsDto)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Búsqueda de vehículo',
		description: 'Permite buscar un vehículo por su ID.',
	})
	@ApiOkResponse({ type: VehicleEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.vehiclesService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualización de vehículo',
		description: 'Permite actualizar los datos de un vehículo.',
	})
	@ApiOkResponse({ type: VehicleEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateVehicleDto: UpdateVehicleDto
	) {
		return this.vehiclesService.update(userId, id, updateVehicleDto)
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Eliminación de vehículo',
		description: 'Permite eliminar un vehículo por su ID.',
	})
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.vehiclesService.remove(userId, id)
	}
}
