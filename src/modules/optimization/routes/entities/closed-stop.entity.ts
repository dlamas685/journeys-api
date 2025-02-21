import { ApiProperty } from '@nestjs/swagger'
import { StopSuggestionEntity } from './stop-suggestion.entity'

export class ClosedStopEntity {
	@ApiProperty({ type: StopSuggestionEntity })
	stop: StopSuggestionEntity

	@ApiProperty({ type: StopSuggestionEntity, isArray: true })
	alternatives: StopSuggestionEntity[]

	constructor(closedStop: Partial<ClosedStopEntity>) {
		Object.assign(this, closedStop)
	}
}
