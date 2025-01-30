import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class LocationDto {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	latitude: number

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	longitude: number
}
