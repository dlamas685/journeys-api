import { FilterTypes } from '../enums'

export const transformToValueType = (value, obj) => {
	const type = obj?.type

	if (!value || value === 'null') return null

	if (type === FilterTypes.NUMBER) return Number(value)

	if (type === FilterTypes.BOOLEAN) return value === 'true'

	if (type === FilterTypes.DATE) return new Date(value)

	if (
		type === FilterTypes.UUID ||
		type === FilterTypes.STRING ||
		type === FilterTypes.ENUM
	)
		return value.toString()

	if (type === FilterTypes.ARRAY_OF_DATES)
		return value.map((v: string) => new Date(v))

	if (type === FilterTypes.ARRAY_OF_NUMBERS)
		return value.map((v: string) => Number(v))

	if (
		type === FilterTypes.ARRAY_OF_STRINGS ||
		type === FilterTypes.ARRAY_OF_ENUM
	)
		return value.map((v: string) => v.toString())

	return value
}
