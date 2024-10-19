import { Transform } from 'class-transformer'
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	ValidateIf,
} from 'class-validator'
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
	isInsensitive?: boolean = true

	@IsNotEmpty()
	@ValidateIf(o => o.value)
	@RuleMatchesValueType()
	rule: FilterRules

	@IsOptional()
	@IsEnum(FilterTypes)
	type?: FilterTypes

	@IsOptional()
	@Transform(transformToValueType)
	value?: any
}
