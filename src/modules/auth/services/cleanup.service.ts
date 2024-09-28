import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { VerificationTokensService } from './verification-tokens.service'

@Injectable()
export class CleanupService {
	constructor(private verificationTokens: VerificationTokensService) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	cleanExpiredTokens() {
		this.verificationTokens.deleteExpired()
	}
}
