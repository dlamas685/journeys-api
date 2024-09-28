import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	ParseUUIDPipe,
	Query,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { VerificationTokenEntity } from '../entities'
import { VerificationTokensService } from '../services/verification-tokens.service'

@ApiTags('Verification Tokens')
@Controller('verification-tokens')
export class VerificationTokensController {
	constructor(private verificationTokens: VerificationTokensService) {}

	@Get('link-validation')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Verifica la existencia de un token',
		description:
			'Permite verificar si un token de verificación existe en la base de datos',
	})
	@ApiOkResponse({ type: VerificationTokenEntity })
	async validateLink(
		@Query('token', ParseUUIDPipe) token: string,
		@Query('email') email: string
	): Promise<VerificationTokenEntity> {
		return this.verificationTokens.findOne(token, email)
	}
}
