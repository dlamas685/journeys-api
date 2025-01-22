import { protos } from '@googlemaps/routeoptimization'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsBoolean,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'
import { LocationDto } from './location.dto'

export class WaypointDto
	implements protos.google.maps.routeoptimization.v1.IWaypoint
{
	@IsOptional()
	@Type(() => LocationDto)
	@ValidateNested()
	@ApiPropertyOptional()
	location?: LocationDto

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	placeId?: string

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	sideOfRoad?: boolean
}
