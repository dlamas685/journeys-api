import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import { JsonValue } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { CreateTripDto } from './create-trip.dto'
import { UpdateTripPresetDto } from './update-trip-preset.dto'

export class UpdateTripDto extends PartialType(
	OmitType(CreateTripDto, ['presets'])
) {
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => UpdateTripPresetDto)
	@ApiPropertyOptional({ type: UpdateTripPresetDto })
	presets?: JsonValue
}
