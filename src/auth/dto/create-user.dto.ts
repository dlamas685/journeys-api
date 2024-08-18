import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches } from 'class-validator'
import { PASSWORD_PATTERN } from 'src/common/constants'

export class CreateUserDto {
	@IsString()
	@Matches(PASSWORD_PATTERN)
	@ApiProperty()
	password: string
}
