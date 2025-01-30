import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'

export class ModifiersDto {
	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	avoidFerries?: boolean

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	avoidHighways?: boolean

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	avoidTolls?: boolean

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	considerRoadTraffic?: boolean
}
