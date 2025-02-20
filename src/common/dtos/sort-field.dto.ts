import { IsEnum, IsNotEmpty } from 'class-validator'
import { SortDirections } from '../enums/sort-directions.enum'

export class SortFieldDto {
	@IsNotEmpty()
	field: string

	@IsEnum(SortDirections)
	direction: SortDirections = SortDirections.ASC
}
