import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Matches } from 'class-validator'
import { PASSWORD_PATTERN } from 'src/common/constants'

export class ResetPasswordDto {
	@IsString()
	@IsNotEmpty()
	token: string

	@Matches(PASSWORD_PATTERN)
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password: string
}
