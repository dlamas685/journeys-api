import { FilterTypes } from '../enums'

export const transformToValueType = (value, obj) => {
	const type = obj?.type

	if (!value) return null

	if (type === FilterTypes.NUMBER) return Number(value)

	if (type === FilterTypes.BOOLEAN) return value === 'true'

	if (type === FilterTypes.DATE) return new Date(value)

	if (type === FilterTypes.ARRAY_OF_DATES)
		return value.map((v: string) => new Date(v))

	if (type === FilterTypes.ARRAY_OF_NUMBERS)
		return value.map((v: string) => Number(v))

	if (type === FilterTypes.ARRAY_OF_STRINGS)
		return value.map((v: string) => v.toString())

	if (type === FilterTypes.STRING) return value.toString()

	return value
}
