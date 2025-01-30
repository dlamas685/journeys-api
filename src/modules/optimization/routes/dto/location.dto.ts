import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class LocationDto {
	@IsNotEmpty()
	@IsNumber()
	@ApiProperty()
	latitude: number

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty()
	longitude: number
}
