import { Decimal } from '@prisma/client/runtime/library'

export class DecimalNumber extends Decimal {
	constructor(value?: any) {
		super(value || 0)
	}
}
