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
	UseGuards,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import { UserId } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ChangePasswordDto, CreateUserDto, UpdateUserDto } from './dto'
import { UserEntity } from './entities/user.entity'
import { UsersService } from './users.service'

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
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
	findAll() {
		return this.users.findAll()
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

	@Post('password-change')
	@ApiOperation({
		summary: 'Cambio de contraseña',
		description: 'Permite cambiar la contraseña de un usuario',
	})
	changePassword(
		@UserId() userId,
		@Body() changePasswordDto: ChangePasswordDto
	) {
		return this.users.changePassword(userId, changePasswordDto)
	}
}
