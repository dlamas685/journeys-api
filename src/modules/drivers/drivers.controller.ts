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
import { DriversService } from './drivers.service'
import { CreateDriverDto } from './dto/create-driver.dto'
import { DriverQueryParamsDto } from './dto/driver-params.dto'
import { UpdateDriverDto } from './dto/update-driver.dto'
import { DriverEntity } from './entities/driver.entity'

@Controller('drivers')
@UseGuards(JwtAuthGuard)
@ApiTags('Drivers')
@ApiBearerAuth('JWT-auth')
export class DriversController {
	constructor(private readonly drivers: DriversService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de conductor',
		description: 'Permite crear un nuevo conductor.',
	})
	@ApiOkResponse({ type: DriverEntity })
	create(@UserId() userId: string, @Body() createDriverDto: CreateDriverDto) {
		return this.drivers.create(userId, createDriverDto)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Listado de conductores',
		description: 'Permite recuperar de forma paginada los conductores.',
	})
	@ApiOkResponsePaginated(DriverEntity)
	findAll(
		@UserId() userId: string,
		@Query() queryParamsDto: DriverQueryParamsDto
	) {
		return this.drivers.findAll(userId, queryParamsDto)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Búsqueda de conductor',
		description: 'Permite buscar un conductor por su ID.',
	})
	@ApiOkResponse({ type: DriverEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.drivers.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualización de conductor',
		description: 'Permite actualizar los datos de un conductor.',
	})
	@ApiOkResponse({ type: DriverEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateDriverDto: UpdateDriverDto
	) {
		return this.drivers.update(userId, id, updateDriverDto)
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Eliminación de conductor',
		description: 'Permite eliminar un conductor por su ID.',
	})
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.drivers.remove(userId, id)
	}
}
