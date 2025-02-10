import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	ValidateNested,
} from 'class-validator'
import { ExtraComputation } from '../enums/extra-computation.enum'
import { ReferenceRoute } from '../enums/reference-route.enum'
import { TrafficModel } from '../enums/traffic-model.enum'
import { VehicleEmissionType } from '../enums/vehicle-emission-type.enum'
import { AdvancedWaypointDto } from './advanced-waypoint.dto'

export class AdvancedCriteriaDto {
	@IsNotEmpty()
	@IsArray()
	@IsEnum(ExtraComputation, { each: true })
	@ApiProperty({
		type: [Number],
		enum: ExtraComputation,
		isArray: true,
	})
	extraComputations: ExtraComputation[]

	@IsOptional()
	@IsArray()
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

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	computeAlternativeRoutes?: boolean

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	optimizeWaypointOrder?: boolean

	@IsOptional()
	@IsEnum(VehicleEmissionType)
	@ApiPropertyOptional({ enum: VehicleEmissionType })
	emissionType?: VehicleEmissionType

	@IsOptional()
	@IsArray()
	@Type(() => AdvancedWaypointDto)
	@ValidateNested({ each: true })
	@ApiPropertyOptional({ type: [AdvancedWaypointDto] })
	interestPoints?: AdvancedWaypointDto[]
}
