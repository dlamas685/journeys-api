import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateActivityDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	description: string

	@IsNumber()
	@IsOptional()
	@ApiPropertyOptional()
	duration?: number
}
