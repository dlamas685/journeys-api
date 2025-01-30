import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptimizationService } from './optimization.service'
import { PresetsDto } from './routes-optimization/dto'
import { RoadmapsOptimizationEntity } from './routes-optimization/entities'
import { AdvancedCriteriaDto, BasicCriteriaDto } from './routes/dto'
import { RouteEntity } from './routes/entities'

@UseGuards(JwtAuthGuard)
@ApiTags('Optimization')
@Controller('optimization')
export class OptimizationController {
	constructor(private readonly optimization: OptimizationService) {}

	@Public()
	@Post('/basic')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Optimización básica',
		description: 'Permite optimizar una ruta siguiendo los criterios básicos.',
	})
	@ApiOkResponse({ type: RouteEntity })
	computeBasicOptimization(@Body() basicCriteriaDto: BasicCriteriaDto) {
		return this.optimization.computeBasicOptimization(basicCriteriaDto)
	}

	@Public()
	@Post('/advanced')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Optimización avanzada',
		description:
			'Permite optimizar una ruta siguiendo los criterios avanzados.',
	})
	@ApiOkResponse({ type: [RouteEntity] })
	computeAdvancedOptimization(
		@Body() advancedCriteriaDto: AdvancedCriteriaDto
	) {
		return this.optimization.computeAdvancedOptimization(advancedCriteriaDto)
	}

	@Public()
	@Post('/tours')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Optimización de recorridos',
		description: 'Permite optimizar los recorridos en la gestión de flotas',
	})
	@ApiOkResponse({ type: [RoadmapsOptimizationEntity] })
	optimizeTours(@Body() presetsDto: PresetsDto) {
		return this.optimization.optimizeTours(presetsDto)
	}
}
