import { TransformFnParams } from 'class-transformer'
import { SortFieldDto } from '../dto'
import { fromSortsToOrderby } from './fromSortsToOrderby.helper'

export const transformToOrderby = ({ value }: TransformFnParams) => {
	if (value.every((item: any) => item instanceof SortFieldDto))
		return fromSortsToOrderby(value)

	return value
}
