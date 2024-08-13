import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function LoginDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Iniciar sesión' }),
		ApiResponse({ status: HttpStatus.OK, description: 'Usuario autenticado' }),
		ApiResponse({
			status: HttpStatus.UNAUTHORIZED,
			description: 'Credenciales inválidas',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Usuario no encontrado',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Error del servidor',
		})
	)
}
