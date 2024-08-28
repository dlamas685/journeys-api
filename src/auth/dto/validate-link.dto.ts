import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class ValidateLinkDto {
	@IsString()
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty()
	readonly token: string

	@IsString()
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	readonly email: string
}
