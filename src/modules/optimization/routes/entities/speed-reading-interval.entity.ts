import { ApiProperty } from '@nestjs/swagger'
import { Speed } from '../enums'

export class SpeedReadingIntervalEntity {
	@ApiProperty()
	startPolylinePointIndex: number

	@ApiProperty()
	endPolylinePointIndex: number

	@ApiProperty({ enum: Speed })
	speed: Speed
}
