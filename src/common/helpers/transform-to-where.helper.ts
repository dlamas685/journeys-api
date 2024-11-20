import { TransformFnParams } from 'class-transformer'
import { FilterFieldDto } from '../dto'
import { fromFiltersToWhere } from './from-filters-to-where.helper'
import { fromLogicalFiltersToWhere } from './from-logical-filters-to-where.helper'

export const transformToWhere = ({ value }: TransformFnParams) => {
	if (value.every((item: any) => item instanceof FilterFieldDto))
		return fromFiltersToWhere(value)

	return fromLogicalFiltersToWhere(value)
}
