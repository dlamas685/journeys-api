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
import { ShipmentModelDto } from './routes-optimization/dto'
import { AdvancedCriteriaDto, BasicCriteriaDto } from './routes/dto'
import {
	AdvancedOptimizationEntity,
	BasicOptimizationEntity,
} from './routes/entities'

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
	@ApiOkResponse({ type: BasicOptimizationEntity })
	computeBasicOptimization(@Body() basicCriteriaDto: BasicCriteriaDto) {
		return this.optimization.computeBasicOptimization(basicCriteriaDto)
	}

	@Public()
	@Post('/advanced')
	@HttpCode(HttpStatus.OK)

	// @ApiBearerAuth('JWT-auth')
	@ApiOperation({
		summary: 'Optimización avanzada',
		description:
			'Permite optimizar una ruta siguiendo los criterios avanzados.',
	})
	@ApiOkResponse({ type: AdvancedOptimizationEntity })
	computeAdvancedOptimization(
		@Body() advancedCriteriaDto: AdvancedCriteriaDto
	) {
		return this.optimization.computeAdvancedOptimization(advancedCriteriaDto)
	}

	@Public()
	@Post('/tours')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Optimización de Recorridos',
		description:
			'Permite optimizar los recorridos en la gestión de flotas o cuando un viaje tiene criterios adicionales.',
	})
	@ApiOkResponse()
	optimizeTours(@Body() shipmentModelDto: ShipmentModelDto) {
		return this.optimization.optimizeTours(shipmentModelDto)
	}
}
