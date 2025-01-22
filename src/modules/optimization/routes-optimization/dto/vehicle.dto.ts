import { protos } from '@googlemaps/routeoptimization'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsEnum,
	IsNumber,
	IsObject,
	IsOptional,
	IsPositive,
	IsString,
	ValidateNested,
} from 'class-validator'
import { TravelMode } from '../enums/travel-mode.enum'
import { LatLngDto } from './lat-lng.dto'
import { LoadLimitDto } from './load-limit.dto'
import { RouteModifiersDto } from './route-modifiers.dto'
import { TimeWindowDto } from './time-window.dto'
import { WaypointDto } from './waypoint.dto'

export class VehicleDto
	implements protos.google.maps.routeoptimization.v1.IVehicle
{
	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	displayName?: string

	@IsOptional()
	@ValidateNested()
	@Type(() => LatLngDto)
	@ApiPropertyOptional()
	startLocation?: LatLngDto

	@IsOptional()
	@ValidateNested()
	@Type(() => WaypointDto)
	@ApiPropertyOptional()
	startWaypoint?: WaypointDto

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => TimeWindowDto)
	@ApiPropertyOptional()
	startTimeWindows?: TimeWindowDto[]

	@IsOptional()
	@ValidateNested()
	@Type(() => LatLngDto)
	@ApiPropertyOptional()
	endLocation?: LatLngDto

	@IsOptional()
	@ValidateNested()
	@Type(() => WaypointDto)
	@ApiPropertyOptional()
	endWaypoint?: WaypointDto

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => TimeWindowDto)
	@ApiPropertyOptional()
	endTimeWindows?: TimeWindowDto[]

	@IsOptional()
	@IsObject()
	@ValidateNested({ each: true })
	@Type(() => LoadLimitDto)
	@ApiPropertyOptional()
	loadLimits?: {
		[k: string]: LoadLimitDto
	}

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	@ApiPropertyOptional()
	fixedCost?: number

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	@ApiPropertyOptional()
	costPerHour?: number

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	@ApiPropertyOptional()
	costPerKilometer?: number

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	@ApiPropertyOptional()
	costPerTraveledHour?: number

	@IsOptional()
	@IsEnum(TravelMode)
	@ApiPropertyOptional()
	travelMode?: TravelMode

	@IsOptional()
	@IsNumber()
	@ApiPropertyOptional()
	travelDurationMultiple?: number

	@IsOptional()
	@ValidateNested()
	@Type(() => RouteModifiersDto)
	@ApiPropertyOptional()
	routeModifiers?: RouteModifiersDto
}
