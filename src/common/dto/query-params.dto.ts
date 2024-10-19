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
	@Transform(transformToQueryArray)
	@Transform(transformToFilterFieldArray, { toClassOnly: true })
	@ValidateNested({ each: true })
	@Type(() => FilterFieldDto)
	// @Transform(transformToWhere, { toPlainOnly: true })
	@ApiPropertyOptional({
		type: String,
		isArray: true,
		example: 'Item Value => property:rule:type:value',
	})
	filters?: FilterFieldDto[]

	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@Transform(transformToQueryArray)
	@Transform(transformToSortFieldArray, { toClassOnly: true })
	@ValidateNested({ each: true })
	@Type(() => SortFieldDto)
	// @Transform(transformToOrderby, { toClassOnly: true })
	@ApiPropertyOptional({
		type: String,
		isArray: true,
		example: 'Item Value => property:asc',
	})
	sorts?: SortFieldDto[]

	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@Transform(transformToQueryArray)
	@Transform(transformToLogicalFilterArray, { toClassOnly: true })
	@ValidateNested({ each: true })
	@Type(() => LogicalFilterDto)
	// @Transform(transformToWhere, { toPlainOnly: true })
	@ApiPropertyOptional({
		type: String,
		isArray: true,
		example: 'Item Value => operator:property:rule:type:value',
	})
	logicalFilters?: LogicalFilterDto[]
}
