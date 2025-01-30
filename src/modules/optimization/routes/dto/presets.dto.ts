import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { AdvancedCriteriaDto } from './advanced-criteria.dto'
import { BasicCriteriaDto } from './basic-criteria.dto'

export class PresetsDto {
	@IsNotEmpty()
	@Type(() => BasicCriteriaDto)
	@ValidateNested()
	@ApiProperty({ type: BasicCriteriaDto })
	basicCriteria: BasicCriteriaDto

	@IsOptional()
	@Type(() => AdvancedCriteriaDto)
	@ValidateNested()
	@ApiPropertyOptional({ type: AdvancedCriteriaDto })
	advancedCriteria: AdvancedCriteriaDto
}
