import { StopEntity } from './stop.entity'

export class SuggestionEntity {
	closedStops: ClosedStopEntity[]
	fuelLoadingStops: StopEntity[]
	restStops: StopEntity[]
}

export class ClosedStopEntity {
	stop: StopEntity
	alternatives: StopEntity[]
}
