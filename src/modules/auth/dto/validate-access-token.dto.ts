import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ValidateAccessTokenDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	token: string
}
