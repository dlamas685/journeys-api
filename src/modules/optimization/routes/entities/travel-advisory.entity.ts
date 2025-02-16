import { ApiProperty } from '@nestjs/swagger'
import { SpeedReadingIntervalEntity } from './speed-reading-interval.entity'
import { TollInfoEntity } from './toll-info.entity'

export class TravelAdvisoryEntity {
	@ApiProperty({ type: TollInfoEntity, nullable: true })
	tollInfo: TollInfoEntity | null

	@ApiProperty({ type: [SpeedReadingIntervalEntity] })
	speedReadingIntervals: SpeedReadingIntervalEntity[]

	@ApiProperty()
	routeRestrictionsPartiallyIgnored: boolean

	constructor() {
		this.tollInfo = new TollInfoEntity()
		this.speedReadingIntervals = []
	}
}
