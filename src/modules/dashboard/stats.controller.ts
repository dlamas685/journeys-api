import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserId } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { StatsService } from './stats.service'

@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiTags('Stats')
@ApiBearerAuth('JWT-auth')
export class StatsController {
	constructor(private readonly statsService: StatsService) {}

	// Todos los KPI para jugar
	@Get('company')
	companyStats(@UserId() userId: string) {
		return this.statsService.companyStats(userId)
	}

	@Get('company-by-month')
	companyStatsByMonth(
		@UserId() userId: string,
		@Query('year') year?: number,
		@Query('month') month?: number
	) {
		return this.statsService.companyStatsByMonth(userId, year, month)
	}
}
