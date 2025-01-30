import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	IsUUID,
} from 'class-validator'

export class AdvancedWaypointActivityDto {
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty()
	id: string

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
