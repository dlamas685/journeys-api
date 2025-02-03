import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseEnumPipe,
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
import { OptimizationService } from './optimization.service'
import { SettingDto } from './routes-optimization/dto'
import { RoadmapsOptimizationEntity } from './routes-optimization/entities'
import { CostProfileEntity } from './routes-optimization/entities/cost-profile.entity'
import { CostProfile } from './routes-optimization/enums/cost-profile.enum'
import { BasicCriteriaDto, CriteriaDto } from './routes/dto'
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
	computeBasicOptimization(@Body() basicCriteria: BasicCriteriaDto) {
		return this.optimization.computeBasicOptimization(basicCriteria)
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
	computeAdvancedOptimization(@Body() criteriaDto: CriteriaDto) {
		return this.optimization.computeAdvancedOptimization(criteriaDto)
	}

	@Public()
	@Post('/tours')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Optimización de recorridos',
		description: 'Permite optimizar los recorridos en la gestión de flotas',
	})
	@ApiOkResponse({ type: [RoadmapsOptimizationEntity] })
	optimizeTours(@Body() settingDto: SettingDto) {
		return this.optimization.optimizeTours(settingDto)
	}

	@Get('/cost-profiles')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Listado de perfiles de costos',
		description: 'Obtiene los perfiles de costos disponibles.',
	})
	@ApiBearerAuth('JWT-auth')
	@ApiOkResponse({ type: [CostProfileEntity] })
	findAllCostProfiles() {
		return this.optimization.findAllCostProfiles()
	}

	@Get('/cost-profiles/:profile')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Búsqueda de un perfil de costo',
		description: 'Obtiene un perfil de costo específico.',
	})
	@ApiBearerAuth('JWT-auth')
	@ApiOkResponse({ type: CostProfileEntity })
	findCostProfile(
		@Param('profile', new ParseEnumPipe(CostProfile)) profile: CostProfile
	) {
		return this.optimization.findCostProfile(profile)
	}
}
