import { Transform } from 'class-transformer'
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	ValidateIf,
} from 'class-validator'
import { RuleMatchesValueType } from '../decorators'
import { FilterRule } from '../decorators/filtering-params.decorator'
import { FilterRules } from '../enums'
import { FilterModes } from '../enums/filter-modes.enum'
import { transformToValueType } from '../helpers'

export class FilterFieldDto {
	@IsNotEmpty()
	field: string

	@IsOptional()
	@IsBoolean()
	isNot?: boolean

	@IsNotEmpty()
	@ValidateIf(
		o => o.rule !== FilterRule.IS_NULL && o.rule !== FilterRule.IS_NOT_NULL
	)
	@RuleMatchesValueType()
	rule: FilterRules

	@IsOptional()
	@IsEnum(FilterModes)
	mode?: FilterModes

	@IsOptional()
	@Transform(transformToValueType)
	value?: any
}
