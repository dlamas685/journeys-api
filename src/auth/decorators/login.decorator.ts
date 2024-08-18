import {
	applyDecorators,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { AuthEntity } from '../entities'
import { LocalAuthGuard } from '../guards/local-auth.guard'

export const Login = () =>
	applyDecorators(
		Post('login'),
		HttpCode(HttpStatus.OK),
		UseGuards(LocalAuthGuard),
		ApiOperation({
			summary: 'Iniciar sesión',
			description: 'Ingresar a la aplicaión',
		}),
		ApiOkResponse({ type: AuthEntity })
	)
