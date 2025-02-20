import { Type } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsOptional,
	ValidateNested,
} from 'class-validator'
import { LogicalOperators } from '../enums/logical-operators.enum'
import { FilterFieldDto } from './filter-field.dto'

export class LogicalFilterDto {
	@IsEnum(LogicalOperators)
	@IsOptional()
	operator?: LogicalOperators = LogicalOperators.AND

	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => FilterFieldDto)
	conditions: FilterFieldDto[]
}
