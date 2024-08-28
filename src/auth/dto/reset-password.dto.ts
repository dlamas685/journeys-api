import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator'
import { PASSWORD_PATTERN } from 'src/common/constants'

export class ResetPasswordDto {
	@IsString()
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty()
	token: string

	@IsEmail()
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	email: string

	@Matches(PASSWORD_PATTERN)
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password: string
}
