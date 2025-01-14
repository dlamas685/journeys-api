import { PartialType } from '@nestjs/swagger'
import { CreateTripPresetDto } from './create-trip-preset.dto'

export class UpdateTripPresetDto extends PartialType(CreateTripPresetDto) {}
