import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ValidateTokenDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	token: string
}
