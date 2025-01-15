import { protos } from '@googlemaps/routing'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class IntegerDto implements protos.google.protobuf.IInt32Value {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	value: number

	constructor(partial: Partial<IntegerDto>) {
		Object.assign(this, partial)
	}
}
