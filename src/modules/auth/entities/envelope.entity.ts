import { ApiProperty } from '@nestjs/swagger'
import { Envelope } from '../types'

export class EnvelopeEntity implements Envelope {
	@ApiProperty()
	from: string

	@ApiProperty({ type: [String], isArray: true })
	to: string[]
}
