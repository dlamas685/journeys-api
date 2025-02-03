import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import { JsonValue } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { SettingDto } from 'src/modules/optimization/routes-optimization/dto'
import { CreateRoadmapDto } from './create-roadmap.dto'

export class UpdateRoadmapDto extends PartialType(
	OmitType(CreateRoadmapDto, ['setting'])
) {
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => SettingDto)
	@ApiPropertyOptional({ type: SettingDto })
	setting?: JsonValue
}
