import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import { JsonValue } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { PresetsDto } from 'src/modules/optimization/routes-optimization/dto'
import { CreateRoadmapDto } from './create-roadmap.dto'

export class UpdateRoadmapDto extends PartialType(
	OmitType(CreateRoadmapDto, ['presets'])
) {
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => PresetsDto)
	@ApiPropertyOptional({ type: PresetsDto })
	presets?: JsonValue
}
