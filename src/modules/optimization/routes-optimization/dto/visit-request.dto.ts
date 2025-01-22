import { protos } from '@googlemaps/routeoptimization'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	ValidateNested,
} from 'class-validator'
import { DurationDto } from './duration.dto'
import { LatLngDto } from './lat-lng.dto'
import { TimeWindowDto } from './time-window.dto'
import { WaypointDto } from './waypoint.dto'

export class VisitRequestDto
	implements protos.google.maps.routeoptimization.v1.Shipment.IVisitRequest
{
	@Type(() => LatLngDto)
	@ValidateNested()
	@IsOptional()
	@ApiPropertyOptional()
	arrivalLocation?: LatLngDto

	@Type(() => WaypointDto)
	@ValidateNested()
	@IsOptional()
	@ApiPropertyOptional()
	arrivalWaypoint?: WaypointDto

	@Type(() => LatLngDto)
	@ValidateNested()
	@IsOptional()
	@ApiPropertyOptional()
	departureLocation?: LatLngDto

	@Type(() => WaypointDto)
	@ValidateNested()
	@IsOptional()
	@ApiPropertyOptional()
	departureWaypoint?: WaypointDto

	@Type(() => DurationDto)
	@ValidateNested()
	@IsNotEmpty()
	@ApiProperty()
	duration: DurationDto

	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	@IsOptional()
	@ApiPropertyOptional()
	cost?: number

	@IsArray()
	@Type(() => TimeWindowDto)
	@ValidateNested({ each: true })
	@IsOptional()
	@ApiPropertyOptional()
	timeWindows?: TimeWindowDto[]
}
