import { SortFieldDto } from '../dto'

export const fromSortsToOrderby = <T extends object>(
	sorts?: SortFieldDto[]
) => {
	const sortQuery: Record<string, any> = {}

	sorts?.forEach(({ field, direction }) => {
		const fieldPath = field.split('.')

		fieldPath.reduce((acc, curr, index) => {
			if (index === fieldPath.length - 1) {
				acc[curr] = direction
			} else {
				acc[curr] = acc[curr] || {}
			}
			return acc[curr]
		}, sortQuery)
	})

	return sortQuery as T
}
