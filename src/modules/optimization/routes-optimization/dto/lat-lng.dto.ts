import { protos } from '@googlemaps/routeoptimization'
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
}
