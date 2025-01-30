import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class AdvancedWaypointConfigDto {
	@IsOptional()
	@IsUUID()
	@ApiPropertyOptional()
	templateId?: string

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	mode: string
}
