import { OmitType } from '@nestjs/swagger'
import { LocalizedValuesEntity } from './localized-values.entity'

export class RouteLegStepLocalizedValues extends OmitType(
	LocalizedValuesEntity,
	['duration'] as const
) {}
