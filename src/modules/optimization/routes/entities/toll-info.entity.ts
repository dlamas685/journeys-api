import { ApiProperty } from '@nestjs/swagger'
import { MoneyEntity } from './money.entity'

export class TollInfoEntity {
	@ApiProperty({ type: [MoneyEntity] })
	estimatedPrice: MoneyEntity[]

	constructor() {
		this.estimatedPrice = []
	}
}
