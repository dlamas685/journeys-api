import {
	applyDecorators,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { UserEntity } from '../entities'
import { LocalAuthGuard } from '../guards/local-auth.guard'

export const EmailVerification = () =>
	applyDecorators(
		Post('email-verification'),
		HttpCode(HttpStatus.OK),
		UseGuards(LocalAuthGuard),
		ApiOperation({
			summary: 'Verificar Correo',
			description:
				'Permite verificar el correo de un usuario. Una vez verificado retorna el jwt para loguearse',
		}),
		ApiOkResponse({ type: UserEntity })
	)
