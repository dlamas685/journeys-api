import { protos } from '@googlemaps/routing'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class LatLngDto implements protos.google.type.ILatLng {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	latitude: number

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	longitude: number

	constructor(partial: Partial<LatLngDto>) {
		Object.assign(this, partial)
	}
}
