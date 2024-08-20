import { applyDecorators, Get, UseGuards } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { GoogleAuthGuard } from '../guards/google-auth.guard'

export const GoogleLogin = () =>
	applyDecorators(
		Get('google/login'),
		UseGuards(GoogleAuthGuard),
		ApiOperation({
			summary: 'Iniciar sesión con Google',
			description: 'Mostrar la página de inicio de sesión de Google',
		})
	)
