import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, Matches } from 'class-validator'
import { PASSWORD_PATTERN } from 'src/common/constants'

export class ChangePasswordDto {
	@IsOptional()
	@IsString()
	@ApiProperty()
	password: string

	@IsOptional()
	@IsString()
	@Matches(PASSWORD_PATTERN)
	@ApiProperty()
	newPassword: string
}
