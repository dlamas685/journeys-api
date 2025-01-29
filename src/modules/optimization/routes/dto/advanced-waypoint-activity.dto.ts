import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
} from 'class-validator'

export class AdvancedWaypointActivityDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	name: string

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	description?: string

	@IsNotEmpty()
	@IsNumber()
	@IsInt()
	@IsPositive()
	@ApiProperty()
	duration: number
}
