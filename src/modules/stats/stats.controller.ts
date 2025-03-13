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

import {
	CompanyStatsByMonthEntity,
	CompanyStatsEntity,
	StatsByMonthEntity,
	StatsEntity,
	TopDriversEntity,
} from './entities'
import { StatsService } from './stats.service'

@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiTags('Stats')
@ApiBearerAuth('JWT-auth')
export class StatsController {
	constructor(private readonly statsService: StatsService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Estadísticas del usuario',
		description: 'Permite recuperar las estadísticas del usuario.',
	})
	@ApiOkResponse({ type: StatsEntity })
	getStats(@UserId() userId: string) {
		return this.statsService.getStats(userId)
	}

	@Get('by-month')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Estadísticas del usuario por mes',
		description: 'Permite recuperar las estadísticas del por mes.',
	})
	@ApiOkResponse({ type: StatsByMonthEntity, isArray: true })
	getStatsByMonth(
		@UserId() userId: string,
		@Query('year') year?: number,
		@Query('month') month?: number
	) {
		return this.statsService.getStatsByMonth(userId, year, month)
	}

	@Get('company')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Estadísticas de la empresa',
		description: 'Permite recuperar las estadísticas de la empresa.',
	})
	@ApiOkResponse({ type: CompanyStatsEntity })
	getCompanyStats(@UserId() userId: string) {
		return this.statsService.getCompanyStats(userId)
	}

	@Get('company/by-month')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Estadísticas de la empresa por mes',
		description: 'Permite recuperar las estadísticas de la empresa por mes.',
	})
	@ApiOkResponse({ type: CompanyStatsByMonthEntity, isArray: true })
	getCompanyStatsByMonth(
		@UserId() userId: string,
		@Query('year') year?: number,
		@Query('month') month?: number
	) {
		return this.statsService.getCompanyStatsByMonth(userId, year, month)
	}

	@Get('company/top-drivers')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Estadísticas de la empresa para obtener los mejores conductores',
		description:
			'Permite recuperar los conductores que más hoja de ruta completaron.',
	})
	@ApiOkResponse({ type: TopDriversEntity })
	getCompanyTopDrivers(@UserId() userId: string) {
		return this.statsService.getCompanyTopDrivers(userId)
	}
}
