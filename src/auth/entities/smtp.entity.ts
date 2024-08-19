import { ApiProperty } from '@nestjs/swagger'
import { Smtp } from '../types'
import { EnvelopeEntity } from './envelope.entity'

export class SmtpEntity implements Smtp {
	@ApiProperty({ type: [String], isArray: true })
	accepted: string[]

	@ApiProperty({ type: [String], isArray: true })
	rejected: string[]

	@ApiProperty({ type: [String], isArray: true })
	ehlo: string[]

	@ApiProperty()
	envelopeTime: number

	@ApiProperty()
	messageTime: number

	@ApiProperty()
	messageSize: number

	@ApiProperty()
	response: string

	@ApiProperty({ type: EnvelopeEntity })
	envelope: EnvelopeEntity

	@ApiProperty()
	messageId: string
}
