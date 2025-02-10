import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional, ValidateNested } from 'class-validator'
import { CostProfile } from '../enums/cost-profile.enum'
import { BoundsDto } from './bounds.dto'
import { CostModelDto } from './cost-model.dto'

export class ThirdStageDto {
	@IsEnum(CostProfile)
	@ApiProperty()
	costProfile: CostProfile

	@IsOptional()
	@ValidateNested()
	@Type(() => CostModelDto)
	@ApiPropertyOptional()
	costModel?: CostModelDto

	@IsOptional()
	@ValidateNested()
	@Type(() => BoundsDto)
	@ApiPropertyOptional()
	bounds?: BoundsDto
}
