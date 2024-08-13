import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { SessionService } from './session.service'

@Injectable()
export class CleanupService {
	constructor(private sessionService: SessionService) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	handleCleanup() {
		this.sessionService.removeExpired()
	}
}
