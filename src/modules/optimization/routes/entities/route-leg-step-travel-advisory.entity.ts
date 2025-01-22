import { PickType } from '@nestjs/swagger'
import { TravelAdvisoryEntity } from './travel-advisory.entity'

export class RouteLegStepTravelAdvisory extends PickType(TravelAdvisoryEntity, [
	'speedReadingIntervals',
] as const) {}
