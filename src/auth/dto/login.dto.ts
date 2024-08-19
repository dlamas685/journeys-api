import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
} from 'class-validator'
import { PASSWORD_PATTERN } from 'src/common/constants'

export class LoginDto {
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	@Transform(({ value }) => value.trim().toLowerCase())
	@ApiProperty()
	email: string

	@IsString()
	@Matches(PASSWORD_PATTERN)
	@IsNotEmpty()
	@ApiProperty()
	password: string

	@IsBoolean()
	@IsOptional()
	@ApiProperty({ required: false, default: false })
	rememberMe?: boolean = false
}
