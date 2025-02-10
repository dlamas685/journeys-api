import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	IsString,
	IsUUID,
} from 'class-validator'

export class AdvancedWaypointActivityDto {
	@IsUUID()
	@ApiProperty()
	id: string

	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	description?: string

	@IsInt()
	@IsPositive()
	@ApiProperty()
	duration: number
}
