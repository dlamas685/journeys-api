import { protos } from '@googlemaps/routeoptimization'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class DurationDto implements protos.google.protobuf.IDuration {
	@IsNumber()
	@ApiProperty()
	nanos: number

	@IsNumber()
	@ApiProperty()
	seconds: number
}
