import { TransformFnParams } from 'class-transformer'

export const transformToValueType = ({ value }: TransformFnParams) => {
	if (typeof value === 'number') return Number(value)

	if (typeof value === 'boolean') return value

	if (!isNaN(Date.parse(value))) return new Date(value)

	if (value instanceof Array)
		return value.map(v => {
			if (typeof v === 'number') return Number(v)

			if (!isNaN(Date.parse(v))) return new Date(v)

			if (typeof v === 'string') return v.trim()
		})

	if (typeof value === 'string') return value.trim()

	return value
}
