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
import { ApiOkResponsePaginated } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateUserDto, UpdateUserDto, UsersQueryParamsDto } from './dto'
import { UserEntity } from './entities'
import { UsersService } from './users.service'

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
	constructor(private readonly users: UsersService) {}

	//TODO: ESTE ENDPOINT ES A MODO DE EJEMPLO NO DEBE USARSE - SOLO SE PERMITE CREAR DESDE AUTH (REGISTRO)
	@Post()
	@ApiExcludeEndpoint()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de usuario',
		description:
			'Permite crear un nuevo usuario con su perfil personal o de empresa',
	})
	create(@Body() createUserDto: CreateUserDto) {
		return this.users.create(createUserDto)
	}

	@Get()
	@ApiOperation({
		summary: 'Listado de usuarios',
		description: 'Permite recuperar de forma paginada los usuarios.',
	})
	@ApiOkResponsePaginated(UserEntity)
	findAll(@Query() queryParamsDto: UsersQueryParamsDto) {
		return this.users.findAll(queryParamsDto)
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Búsqueda de usuario',
		description: 'Permite buscar un usuario por su ID',
	})
	@ApiOkResponse({ type: UserEntity })
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.users.findOne(id)
	}

	//TODO: ESTE ENDPOINT ES A MODO DE EJEMPLO NO DEBE USARSE - ACTUALIZACIONES VIA MODULO OPTIONS
	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiExcludeEndpoint()
	@ApiOperation({
		summary: 'Actualización de usuario',
		description:
			'Permite actualizar los datos de un usuario y su perfil personal o de empresa',
	})
	@ApiOkResponse({ type: UserEntity })
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.users.update(id, updateUserDto)
	}

	//TODO: ESTE ENDPOINT ES A MODO DE EJEMPLO NO DEBE USARSE - ELIMINACIONES VIA MODULO OPTIONS
	@Delete(':id')
	@ApiExcludeEndpoint()
	@ApiOperation({
		summary: 'Eliminación de usuario',
		description: 'Permite eliminar un usuario por su ID',
	})
	@ApiOkResponse({ type: UserEntity })
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.users.remove(id)
	}
}
