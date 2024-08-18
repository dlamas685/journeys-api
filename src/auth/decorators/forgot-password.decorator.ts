import { applyDecorators, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { SmtpEntity } from '../entities/smtp.entity'

export const ForgotPassword = () =>
	applyDecorators(
		Post('forgot-password'),
		HttpCode(HttpStatus.OK),
		ApiOperation({
			summary: 'Olvidé mi contraseña',
			description: 'Solicitar cambio de contraseña',
		}),
		ApiOkResponse({ type: SmtpEntity })
	)
