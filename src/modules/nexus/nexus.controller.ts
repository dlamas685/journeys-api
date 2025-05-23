import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Query,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserId } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AvailableRoadmapAssetQueryParamsDto } from './dtos/available-roadmap-asset-query'
import { NexusService } from './nexus.service'

@Controller()
@UseGuards(JwtAuthGuard)
@ApiTags('Nexus')
@ApiBearerAuth('JWT-auth')
export class NexusController {
	constructor(private readonly nexusService: NexusService) {}

	@Get('available-roadmap-assets')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Obtiene las flotas, vehículos y conductores disponibles',
	})
	availableRoadmapAssets(
		@UserId() userId: string,
		@Query() dateRange: AvailableRoadmapAssetQueryParamsDto
	) {
		return this.nexusService.availableRoadmapAssets(userId, dateRange)
	}
}
