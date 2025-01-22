import { ApiProperty } from '@nestjs/swagger'

export class MoneyEntity {
	@ApiProperty()
	currencyCode: string

	@ApiProperty()
	units: string

	@ApiProperty()
	nanos: number

	constructor(partial: Partial<MoneyEntity>) {
		Object.assign(this, partial)
	}
}
