import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import { JsonValue } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { CreateActivityTemplateDto } from './create-activity-template.dto'
import { UpdateActivityDto } from './update-activity.dto'

export class UpdateActivityTemplateDto extends PartialType(
	OmitType(CreateActivityTemplateDto, ['activities'])
) {
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => UpdateActivityDto)
	@ApiPropertyOptional({ type: [UpdateActivityDto] })
	activities?: JsonValue
}
