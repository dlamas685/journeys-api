import { ApiPropertyOptional } from '@nestjs/swagger'
import { ClosedStopEntity } from './closed-stop.entity'
import { StopSuggestionEntity } from './stop-suggestion.entity'

export class SuggestionEntity {
	@ApiPropertyOptional({ type: ClosedStopEntity, isArray: true })
	closedStops?: ClosedStopEntity[]

	@ApiPropertyOptional({ type: StopSuggestionEntity, isArray: true })
	fuelLoadingStops?: StopSuggestionEntity[]

	@ApiPropertyOptional({ type: StopSuggestionEntity, isArray: true })
	restStops?: StopSuggestionEntity[]

	constructor(suggestion: Partial<SuggestionEntity>) {
		Object.assign(this, suggestion)
	}
}
