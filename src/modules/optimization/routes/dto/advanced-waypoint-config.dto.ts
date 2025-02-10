import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

export class AdvancedWaypointConfigDto {
	@IsOptional()
	@IsUUID()
	@ApiPropertyOptional()
	templateId?: string

	@IsNotEmpty()
	@ApiProperty()
	mode: string
}
