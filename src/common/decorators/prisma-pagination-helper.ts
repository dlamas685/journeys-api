import { Filtering, FilterRule } from './filtering-params.decorator'
import { Sorting } from './sorting-params.decorator'

export const getOrder = (sort: Sorting[]) => {
	const sortQuery = sort.map(element => ({
		[element.property]: element.direction,
	}))

	return sortQuery
}

export const getWhere = (filters: Filtering[]) => {
	if (!filters) return {}

	let filterQuery: Record<string, any> = {}

	filters.map(filter => {
		switch (filter.rule) {
			case FilterRule.IS_NULL:
				filterQuery = { ...filterQuery, [filter.property]: null }
				break

			case FilterRule.IS_NOT_NULL:
				filterQuery = { ...filterQuery, [filter.property]: { not: null } }
				break

			case FilterRule.EQUALS:
				filterQuery = {
					...filterQuery,
					[filter.property]: { equals: filter.value },
				}
				break

			case FilterRule.NOT_EQUALS:
				filterQuery = {
					...filterQuery,
					[filter.property]: { not: filter.value },
				}
				break

			case FilterRule.GREATER_THAN:
				filterQuery = {
					...filterQuery,
					[filter.property]: { gt: filter.value },
				}
				break

			case FilterRule.GREATER_THAN_OR_EQUALS:
				filterQuery = {
					...filterQuery,
					[filter.property]: { gte: filter.value },
				}
				break

			case FilterRule.LESS_THAN:
				filterQuery = {
					...filterQuery,
					[filter.property]: { lt: filter.value },
				}
				break

			case FilterRule.LESS_THAN_OR_EQUALS:
				filterQuery = {
					...filterQuery,
					[filter.property]: { lte: filter.value },
				}
				break

			case FilterRule.LIKE:
				filterQuery = {
					...filterQuery,
					[filter.property]: { contains: `%${filter.value}%` },
				}
				break

			case FilterRule.NOT_LIKE:
				filterQuery = {
					...filterQuery,
					[filter.property]: { not: { contains: `%${filter.value}%` } },
				}
				break

			case FilterRule.IN:
				filterQuery = {
					...filterQuery,
					[filter.property]: { in: [filter.value.split(',')] },
				}
				break

			case FilterRule.NOT_IN:
				filterQuery = {
					...filterQuery,
					[filter.property]: { notIn: [filter.value.split(',')] },
				}
				break
			default:
				break
		}
	})
	return filterQuery
}
