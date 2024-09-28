import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePersonalProfileDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	firstName: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	lastName: string
}
