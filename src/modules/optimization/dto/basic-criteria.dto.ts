import { protos } from '@googlemaps/routing'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	ValidateNested,
} from 'class-validator'
import { RoutingPreference, TravelMode } from '../enums'
import { RouteModifiersDto } from './route-modifiers.dto'
import { TimestampDto } from './timestamp.dto'
import { WaypointDto } from './waypoint.dto'

export class BasicCriteriaDto
	implements protos.google.maps.routing.v2.IComputeRoutesRequest
{
	@IsNotEmpty()
	@Type(() => WaypointDto)
	@ApiProperty({ type: WaypointDto })
	origin: WaypointDto

	@IsNotEmpty()
	@Type(() => WaypointDto)
	@ApiProperty({ type: WaypointDto })
	destination: WaypointDto

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => WaypointDto)
	@ApiPropertyOptional({ type: [WaypointDto] })
	intermediates?: WaypointDto[]

	@IsOptional()
	@IsEnum(TravelMode)
	@ApiPropertyOptional({ enum: TravelMode })
	travelMode?: TravelMode = TravelMode.DRIVE

	@IsOptional()
	@Type(() => TimestampDto)
	@ApiPropertyOptional({ type: TimestampDto })
	departureTime?: TimestampDto

	@IsOptional()
	@IsEnum(RoutingPreference)
	@ApiPropertyOptional({ enum: RoutingPreference })
	routingPreference?: RoutingPreference =
		RoutingPreference.ROUTING_PREFERENCE_UNSPECIFIED

	@IsOptional()
	@Type(() => RouteModifiersDto)
	@ApiPropertyOptional({ type: RouteModifiersDto })
	routeModifiers?: RouteModifiersDto

	constructor(partial: Partial<BasicCriteriaDto>) {
		Object.assign(this, partial)
	}
}
