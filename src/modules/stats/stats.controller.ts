import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Query,
	UseGuards,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import { UserId } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CompanyStatsEntity } from './entities/company-stats.entity'
import { StatsService } from './stats.service'

@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiTags('Stats')
@ApiBearerAuth('JWT-auth')
export class StatsController {
	constructor(private readonly statsService: StatsService) {}

	@Get('company')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Estadísticas de la empresa',
		description: 'Permite recuperar las estadísticas de la empresa.',
	})
	@ApiOkResponse({ type: CompanyStatsEntity })
	companyStats(@UserId() userId: string) {
		return this.statsService.companyStats(userId)
	}

	@Get('company-by-month')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Estadísticas de la empresa por mes',
		description: 'Permite recuperar las estadísticas de la empresa por mes.',
	})
	@ApiOkResponse({ type: CompanyStatsEntity })
	companyStatsByMonth(
		@UserId() userId: string,
		@Query('year') year?: number,
		@Query('month') month?: number
	) {
		return this.statsService.companyStatsByMonth(userId, year, month)
	}
}
