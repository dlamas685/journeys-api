import { protos } from '@googlemaps/routing'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { IntegerDto } from './integer.dto'
import { LatLngDto } from './lat-lng.dto'

export class LocationDto implements protos.google.maps.routing.v2.ILocation {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => LatLngDto)
	@ApiProperty({ type: LatLngDto })
	latLng: LatLngDto

	@IsOptional()
	@ValidateNested()
	@Type(() => IntegerDto)
	@ApiPropertyOptional({ type: IntegerDto })
	heading?: IntegerDto

	constructor(partial: Partial<LocationDto>) {
		Object.assign(this, partial)
	}
}
