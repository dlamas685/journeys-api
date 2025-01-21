import { ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'
import { ExtraComputation, ReferenceRoute, TrafficModel } from '../enums'
import { AdvancedWaypointDto } from './advanced-waypoint.dto'
import { BasicCriteriaDto } from './basic-criteria.dto'

export class AdvancedCriteriaDto extends OmitType(BasicCriteriaDto, [
	'intermediates',
] as const) {
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

	@IsString()
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

	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => AdvancedWaypointDto)
	@ApiPropertyOptional({ type: [AdvancedWaypointDto] })
	intermediates?: AdvancedWaypointDto[]
}
