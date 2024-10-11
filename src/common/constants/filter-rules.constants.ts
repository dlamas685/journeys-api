import { FilterRules } from '../enums'

export const VALID_ARRAY_RULES = [FilterRules.IN, FilterRules.NOT_IN]

export const VALID_DATE_RULES = [
	FilterRules.EQUALS,
	FilterRules.GREATER_THAN,
	FilterRules.GREATER_THAN_OR_EQUALS,
	FilterRules.LESS_THAN,
	FilterRules.LESS_THAN_OR_EQUALS,
]

export const VALID_NUMBER_RULES = [
	FilterRules.EQUALS,
	FilterRules.GREATER_THAN,
	FilterRules.GREATER_THAN_OR_EQUALS,
	FilterRules.LESS_THAN,
	FilterRules.LESS_THAN_OR_EQUALS,
]

export const VALID_STRING_RULES = [
	FilterRules.EQUALS,
	FilterRules.CONTAINS,
	FilterRules.STARTS_WITH,
	FilterRules.ENDS_WITH,
	FilterRules.LIKE,
]
