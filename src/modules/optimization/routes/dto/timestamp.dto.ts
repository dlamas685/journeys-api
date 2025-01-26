import { protos } from '@googlemaps/routing'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class TimestampDto implements protos.google.protobuf.ITimestamp {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	nanos: number

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	seconds: number
}
