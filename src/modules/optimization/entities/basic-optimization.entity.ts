import { ApiProperty } from '@nestjs/swagger'

export class BasicOptimizationEntity {
	@ApiProperty()
	distance: string

	@ApiProperty()
	duration: string

	@ApiProperty()
	encodedPolyline: string

	constructor(partial: Partial<BasicOptimizationEntity>) {
		Object.assign(this, partial)
	}
}
