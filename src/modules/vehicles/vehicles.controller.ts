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
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger'
import { UserId } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
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
	@ApiOkResponse({ type: VehicleEntity })
	create(@UserId() userId: string, @Body() createVehicleDto: CreateVehicleDto) {
		return this.vehiclesService.create(userId, createVehicleDto)
	}

	@Get()
	@ApiQuery({
		name: 'fleetId',
		type: String,
		required: false,
	})
	@ApiOkResponse({ type: [VehicleEntity] })
	findAll(
		@UserId() userId: string,
		@Query('fleetId', new ParseUUIDPipe({ optional: true }))
		fleetId?: string
	) {
		return this.vehiclesService.findAll(userId, fleetId)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: VehicleEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.vehiclesService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: VehicleEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateVehicleDto: UpdateVehicleDto
	) {
		return this.vehiclesService.update(userId, id, updateVehicleDto)
	}

	@Delete(':id')
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.vehiclesService.remove(userId, id)
	}
}
