import { PickType } from '@nestjs/swagger'
import { TravelAdvisoryEntity } from './travel-advisory.entity'

export class RouteLegTravelAdvisoryEntity extends PickType(
	TravelAdvisoryEntity,
	['tollInfo', 'speedReadingIntervals']
) {}
