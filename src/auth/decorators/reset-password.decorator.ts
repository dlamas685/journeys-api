import { applyDecorators, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { UserEntity } from '../entities'

export const ResetPassword = () =>
	applyDecorators(
		Post('reset-password'),
		HttpCode(HttpStatus.OK),
		ApiOperation({
			summary: 'Reestablecer contraseña',
			description: 'Cambiar la contraseña del usuario',
		}),
		ApiOkResponse({ type: UserEntity })
	)
