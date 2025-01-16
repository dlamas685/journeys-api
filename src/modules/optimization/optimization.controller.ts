import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import { Public } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { BasicCriteriaDto } from './dto'
import { BasicOptimizationEntity } from './entities'
import { OptimizationService } from './optimization.service'

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

	@Post('/advanced')
	@HttpCode(HttpStatus.OK)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({
		summary: 'Optimización avanzada',
		description:
			'Permite optimizar una ruta siguiendo los criterios avanzados.',
	})
	computeAdvancedOptimization() {
		return this.optimization.computeAdvancedOptimization()
	}
}
