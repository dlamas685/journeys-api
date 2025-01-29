import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'

export class ModifiersDto {
	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	avoidFerries?: boolean = false

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	avoidHighways?: boolean = false

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	avoidTolls?: boolean = false
}
