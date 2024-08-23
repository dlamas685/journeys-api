import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class RequestPasswordResetDto {
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	@Transform(({ value }) => value.trim())
	@ApiProperty()
	email: string
}
