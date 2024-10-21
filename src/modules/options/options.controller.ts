import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
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
import { UpdateUserDto } from '../users/dto'
import { UserEntity } from '../users/entities'
import { UsersService } from '../users/users.service'
import { ChangePasswordDto } from './dto/change-password.dto'
import { OptionsService } from './options.service'

@ApiTags('Options')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('options')
export class OptionsController {
	constructor(
		private readonly users: UsersService,
		private readonly options: OptionsService
	) {}

	@Get('profile')
	@ApiOperation({
		summary: 'Obtener mi perfil',
		description: 'Permite obtener el perfil del usuario autenticado',
	})
	@ApiOkResponse({ type: UserEntity })
	findProfile(@UserId() id: string) {
		return this.users.findOne(id)
	}

	@Patch('profile')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualizar datos de mi perfil',
		description:
			'Permite actualizar los datos del usuario autenticado y su perfil personal o de empresa',
	})
	@ApiOkResponse({ type: UserEntity })
	updateProfile(@UserId() id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.users.update(id, updateUserDto)
	}

	@Delete('security')
	@ApiOperation({
		summary: 'Eliminar mi cuenta',
		description: 'Permite eliminar la cuenta del usuario autenticado',
	})
	@ApiOkResponse({ type: UserEntity })
	removeAccount(@UserId() id: string) {
		return this.users.remove(id)
	}

	@Patch('security')
	@ApiOperation({
		summary: 'Cambiar mi contraseña',
		description: 'Permite cambiar la contraseña del usuario autenticado',
	})
	changePassword(
		@UserId() userId,
		@Body() changePasswordDto: ChangePasswordDto
	) {
		return this.options.changePassword(userId, changePasswordDto)
	}

	@Get('security/password-exists')
	@ApiOperation({
		summary: 'Verificar si tengo contraseña',
		description: 'Permite verificar si el usuario autenticado tiene contraseña',
	})
	@ApiOkResponse({ type: Boolean })
	hasPassword(@UserId() userId) {
		return this.options.hasPassword(userId)
	}
}
