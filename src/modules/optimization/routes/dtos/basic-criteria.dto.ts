import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsDateString,
	IsEnum,
	IsOptional,
	ValidateNested,
} from 'class-validator'
import { TrafficOption, TravelMode } from '../enums'
import { ModifiersDto } from './modifiers.dto'
import { WaypointDto } from './waypoint.dto'

export class BasicCriteriaDto {
	@Type(() => WaypointDto)
	@ValidateNested()
	@ApiProperty()
	origin: WaypointDto

	@Type(() => WaypointDto)
	@ValidateNested()
	@ApiProperty()
	destination: WaypointDto

	@IsDateString()
	@ApiProperty()
	departureTime: string

	@IsOptional()
	@Type(() => WaypointDto)
	@ValidateNested({ each: true })
	@ApiPropertyOptional()
	interestPoints?: WaypointDto[]

	@IsEnum(TravelMode)
	@ApiProperty({ enum: TravelMode })
	travelMode: TravelMode

	@IsOptional()
	@IsEnum(TrafficOption)
	@ApiPropertyOptional({ enum: TrafficOption })
	trafficOption?: TrafficOption = TrafficOption.TRAFFIC_UNAWARE

	@IsOptional()
	@Type(() => ModifiersDto)
	@ValidateNested()
	@ApiPropertyOptional()
	modifiers?: ModifiersDto
}
