import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ValidateLinkDto } from '../dto'
import { VerificationTokenEntity } from '../entities'
import { VerificationTokensService } from '../services/verification-tokens.service'

@ApiTags('Verification Tokens')
@Controller('verification-tokens')
export class VerificationTokensController {
	constructor(private verificationTokens: VerificationTokensService) {}

	@Post('link-validation')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Validación de enlace',
		description:
			'Valida un enlace de verificación de correo electrónico o restablecimiento de contraseña',
	})
	@ApiOkResponse({ type: VerificationTokenEntity })
	async validateLink(
		@Body() validateLinkDto: ValidateLinkDto
	): Promise<VerificationTokenEntity> {
		return this.verificationTokens.findOne(
			validateLinkDto.token,
			validateLinkDto.email
		)
	}
}
