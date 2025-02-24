import { Transform } from 'class-transformer'
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { RuleMatchesValueType } from '../decorators'
import { FilterRules, FilterTypes } from '../enums'
import { transformToValueType } from '../helpers'

export class FilterFieldDto {
	@IsNotEmpty()
	field: string

	@IsOptional()
	@IsBoolean()
	isNot?: boolean = false

	@IsOptional()
	@IsBoolean()
	isInsensitive?: boolean

	@IsNotEmpty()
	@RuleMatchesValueType()
	rule: FilterRules

	@IsEnum(FilterTypes)
	type: FilterTypes

	@IsNotEmpty()
	@Transform(({ value, obj }) => transformToValueType(value, obj))
	value: any
}
