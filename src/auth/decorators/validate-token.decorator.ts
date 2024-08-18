import { applyDecorators, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'

export const ValidateToken = () =>
	applyDecorators(
		Post('validate-token'),
		HttpCode(HttpStatus.OK),
		ApiOperation({
			summary: 'Validar token',
			description: 'Permite validar un token (mail, password, etc)',
		}),
		ApiOkResponse({ type: null })
	)
