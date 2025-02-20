import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class LocationDto {
	@IsNumber()
	@ApiProperty()
	latitude: number

	@IsNumber()
	@ApiProperty()
	longitude: number
}
