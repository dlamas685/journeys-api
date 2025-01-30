import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
} from 'class-validator'

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
	@IsPositive()
	@IsOptional()
	@ApiPropertyOptional()
	duration?: number
}
