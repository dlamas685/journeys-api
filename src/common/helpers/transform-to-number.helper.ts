import { Decimal } from '@prisma/client/runtime/library'

export const transformToNumber = ({ value }) =>
	value instanceof Decimal ? value.toNumber() : value
