import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsOptional,
	ValidateNested,
} from 'class-validator'
import { ExtraComputation } from '../enums/extra-computation.enum'
import { ReferenceRoute } from '../enums/reference-route.enum'
import { TrafficModel } from '../enums/traffic-model.enum'
import { VehicleEmissionType } from '../enums/vehicle-emission-type.enum'
import { AdvancedWaypointDto } from './advanced-waypoint.dto'

export class AdvancedCriteriaDto {
	@IsOptional()
	@IsArray()
	@Type(() => AdvancedWaypointDto)
	@ValidateNested({ each: true })
	@ApiPropertyOptional({ type: [AdvancedWaypointDto] })
	interestPoints?: AdvancedWaypointDto[]

	@IsArray()
	@IsEnum(ExtraComputation, { each: true })
	@ApiPropertyOptional({
		type: [Number],
		enum: ExtraComputation,
		isArray: true,
	})
	extraComputations?: ExtraComputation[]

	@IsArray()
	@IsOptional()
	@IsEnum(ReferenceRoute, { each: true })
	@ApiPropertyOptional({
		type: [Number],
		enum: ReferenceRoute,
		isArray: true,
	})
	requestedReferenceRoutes?: ReferenceRoute[]

	@IsOptional()
	@IsEnum(TrafficModel)
	@ApiPropertyOptional({ enum: TrafficModel })
	trafficModel?: TrafficModel

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional()
	computeAlternativeRoutes?: boolean

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional()
	optimizeWaypointOrder?: boolean

	@IsOptional()
	@IsEnum(VehicleEmissionType)
	@ApiPropertyOptional({ enum: VehicleEmissionType })
	emissionType?: VehicleEmissionType
}
