import { protos } from '@googlemaps/routeoptimization'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	ValidateNested,
} from 'class-validator'
import { LatLngDto } from './lat-lng.dto'

export class LocationDto
	implements protos.google.maps.routeoptimization.v1.ILocation
{
	@IsNotEmpty()
	@Type(() => LatLngDto)
	@ValidateNested()
	@ApiProperty()
	latLng: LatLngDto

	@IsOptional()
	@IsNumber()
	@ApiPropertyOptional()
	heading?: number
}
