import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class LoginDto {
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => value.trim().toLowerCase())
	@ApiProperty()
	email: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password: string

	@IsBoolean()
	@IsOptional()
	@ApiProperty({ required: false, default: false })
	rememberMe?: boolean = false
}
