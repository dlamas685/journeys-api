import { FilterFieldDto } from '../dto'
import { FilterRules } from '../enums'

export const fromFiltersToWhere = <T extends object>(
	filters: FilterFieldDto[]
) => {
	const where: Record<string, any> = {}

	const applyRule = (
		field: string,
		rule: FilterRules,
		value: any,
		isNot: boolean,
		mode?: string
	) => {
		if (!value) return isNot ? { not: null, mode } : null
		if (rule === FilterRules.LIKE)
			return isNot
				? { not: { contains: `%${value}%`, mode } }
				: { contains: `%${value}%`, mode }
		return isNot ? { not: { [rule]: value, mode } } : { [rule]: value, mode }
	}

	filters.forEach(({ field, rule, value, isNot, mode }) => {
		const applyTo = (obj: Record<string, any>, fieldPath: string[]) =>
			fieldPath.reduce(
				(acc, curr, index) =>
					index === fieldPath.length - 1
						? (acc[curr] = applyRule(curr, rule, value, isNot, mode))
						: (acc[curr] = acc[curr] || {}),
				obj
			)

		const fieldPath = field.split('.')
		applyTo(where, fieldPath)
	})

	return where as T
}
