import { LogicalFilterDto } from '../dto'
import { fromFiltersToWhere } from './from-filters-to-where.helper'

export const fromLogicalFiltersToWhere = <T extends object>(
	logicalFilters?: LogicalFilterDto[]
) => {
	const where: Record<string, any> = {}

	logicalFilters?.forEach(logicalFilter => {
		where[logicalFilter.operator] = logicalFilter.conditions.map(condition =>
			fromFiltersToWhere([condition])
		)
	})

	return where as T
}
