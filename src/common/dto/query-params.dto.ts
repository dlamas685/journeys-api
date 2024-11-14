import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsOptional,
	IsPositive,
	ValidateNested,
} from 'class-validator'
import {
	transformToFilterFieldArray,
	transformToLogicalFilterArray,
	transformToQueryArray,
	transformToSortFieldArray,
} from '../helpers'
import { FilterFieldDto } from './filter-field.dto'
import { LogicalFilterDto } from './logical-filters.dto'
import { SortFieldDto } from './sort-field.dto'

export class QueryParamsDto {
	@IsOptional()
	@IsPositive()
	@Type(() => Number)
	@ApiPropertyOptional()
	page?: number = 1

	@IsOptional()
	@IsPositive()
	@Type(() => Number)
	@ApiPropertyOptional()
	limit?: number = 10

	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@Transform(({ value }) => transformToQueryArray(value))
	@Transform(({ value }) => transformToFilterFieldArray(value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => FilterFieldDto)
	@ApiPropertyOptional({
		type: String,
		isArray: true,
		example: 'Item Value => field:rule:type:value',
	})
	filters?: FilterFieldDto[]

	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@Transform(({ value }) => transformToQueryArray(value))
	@Transform(({ value }) => transformToSortFieldArray(value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => SortFieldDto)
	@ApiPropertyOptional({
		type: String,
		isArray: true,
		example: 'Item Value => field:asc',
	})
	sorts?: SortFieldDto[]

	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@Transform(({ value }) => transformToQueryArray(value))
	@Transform(({ value }) => transformToLogicalFilterArray(value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => LogicalFilterDto)
	@ApiPropertyOptional({
		type: String,
		isArray: true,
		example: 'Item Value => operator:field:rule:type:value',
	})
	logicalFilters?: LogicalFilterDto[]
}
