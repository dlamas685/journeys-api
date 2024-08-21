import { applyDecorators, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { string } from 'joi'

export const SignUp = () =>
	applyDecorators(
		Post('sign-up'),
		HttpCode(HttpStatus.OK),
		ApiOperation({
			summary: 'Registrar un nuevo usuario',
			description: 'Permite registrar un nuevo usuario',
		}),
		ApiOkResponse({ type: string })
	)
