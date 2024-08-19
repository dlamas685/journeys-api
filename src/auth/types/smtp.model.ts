export type Smtp = {
	accepted: string[]
	rejected: string[]
	ehlo: string[]
	envelopeTime: number
	messageTime: number
	messageSize: number
	response: string
	envelope: Envelope
	messageId: string
}

export type Envelope = {
	from: string
	to: string[]
}
