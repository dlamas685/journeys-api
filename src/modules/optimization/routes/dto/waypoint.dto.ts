import { protos } from '@googlemaps/routing'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsBoolean,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'
import { LocationDto } from './location.dto'

export class WaypointDto implements protos.google.maps.routing.v2.IWaypoint {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	address?: string

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	placeId?: string

	@IsOptional()
	@ValidateNested()
	@Type(() => LocationDto)
	@ApiPropertyOptional({ type: LocationDto })
	location?: LocationDto

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional()
	sideOfRoad?: boolean

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional()
	vehicleStopover?: boolean

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional()
	via?: boolean

	constructor(partial: Partial<WaypointDto>) {
		Object.assign(this, partial)
	}
}
