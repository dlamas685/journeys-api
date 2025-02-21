import { ApiProperty } from '@nestjs/swagger'
import { StopEntity } from './stop.entity'

export class StopSuggestionEntity extends StopEntity {
	@ApiProperty()
	name: string

	constructor(stopSuggestion: Partial<StopSuggestionEntity>) {
		super()
		Object.assign(this, stopSuggestion)
	}
}
