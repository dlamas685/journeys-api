import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { BoundsDto } from './bounds.dto'
import { CostModelDto } from './cost-model.dto'

export class ThirdStageDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CostModelDto)
	@ApiProperty()
	costModel: CostModelDto

	@IsOptional()
	@ValidateNested()
	@Type(() => BoundsDto)
	@ApiPropertyOptional()
	bounds?: BoundsDto
}
