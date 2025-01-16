import { protos } from '@googlemaps/routing'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class TimestampDto implements protos.google.protobuf.ITimestamp {
	@IsOptional()
	@IsNumber()
	@ApiPropertyOptional()
	nanos?: number | null

	@IsOptional()
	@IsNumber()
	@ApiPropertyOptional()
	seconds?: number | null

	constructor(partial: Partial<TimestampDto>) {
		Object.assign(this, partial)
	}
}
