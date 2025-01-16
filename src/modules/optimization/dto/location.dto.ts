import { protos } from '@googlemaps/routing'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { IntegerDto } from './integer.dto'
import { LatLngDto } from './lat-lng.dto'

export class LocationDto implements protos.google.maps.routing.v2.ILocation {
	@IsNotEmpty()
	@Type(() => LatLngDto)
	@ApiProperty({ type: LatLngDto })
	latLng: LatLngDto

	@IsNotEmpty()
	@Type(() => IntegerDto)
	@ApiProperty({ type: IntegerDto })
	heading?: IntegerDto

	constructor(partial: Partial<LocationDto>) {
		Object.assign(this, partial)
	}
}
