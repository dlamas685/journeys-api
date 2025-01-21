import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AdvancedWaypointConfigDto {
	@IsString()
	@ApiPropertyOptional()
	template?: string

	@IsString()
	@ApiPropertyOptional()
	mode?: string
}
