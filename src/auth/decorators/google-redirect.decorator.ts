import { applyDecorators, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { AuthEntity } from '../entities'
import { GoogleAuthGuard } from '../guards/google-auth.guard'

export const GoogleRedirect = () =>
	applyDecorators(
		Get('google/redirect'),
		UseGuards(GoogleAuthGuard),
		ApiOperation({
			summary: 'Redirección de Google',
			description: 'Ingresar a la aplicaión con Google',
		}),
		ApiOkResponse({ type: AuthEntity })
	)
