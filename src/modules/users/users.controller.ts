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
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import { CreateUserDto, UpdateUserDto, UsersQueryParamsDto } from './dto'
import { UserEntity } from './entities/user.entity'
import { UsersService } from './users.service'

@ApiTags('Users')
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
	constructor(private readonly users: UsersService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear usuario',
		description:
			'Permite crear un nuevo usuario con su perfil personal o de empresa',
	})
	create(@Body() createUserDto: CreateUserDto) {
		return this.users.create(createUserDto)
	}

	@Get()
	@ApiOperation({
		summary: 'Listar usuarios',
		description: 'Permite listar todos los usuarios',
	})
	@ApiOkResponse({ type: [UserEntity] })
	findAll(@Query() queryParamsDto: UsersQueryParamsDto) {
		console.log(queryParamsDto)
		return this.users.findAll(queryParamsDto)
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Buscar usuario',
		description: 'Permite buscar un usuario por su ID',
	})
	@ApiOkResponse({ type: UserEntity })
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.users.findOne(id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualizar usuario',
		description:
			'Permite actualizar los datos de un usuario y su perfil personal o de empresa',
	})
	@ApiOkResponse({ type: UserEntity })
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.users.update(id, updateUserDto)
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Eliminar usuario',
		description: 'Permite eliminar un usuario por su ID',
	})
	@ApiOkResponse({ type: UserEntity })
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.users.remove(id)
	}
}
