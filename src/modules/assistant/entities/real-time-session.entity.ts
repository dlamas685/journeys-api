import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RealTimeSessionEntity {
	@ApiProperty()
	clientSecret: string

	@ApiPropertyOptional()
	instructions?: string

	constructor(realTimeSession: Partial<RealTimeSessionEntity>) {
		Object.assign(this, realTimeSession)
	}
}
