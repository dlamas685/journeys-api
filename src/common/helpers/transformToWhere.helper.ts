import { TransformFnParams } from 'class-transformer'
import { FilterFieldDto } from '../dto'
import { fromFiltersToWhere } from './fromFiltersToWhere.helper'
import { fromLogicalFiltersToWhere } from './fromLogicalFiltersToWhere.helper'

export const transformToWhere = ({ value }: TransformFnParams) => {
	if (value.every((item: any) => item instanceof FilterFieldDto))
		return fromFiltersToWhere(value)

	return fromLogicalFiltersToWhere(value)
}
