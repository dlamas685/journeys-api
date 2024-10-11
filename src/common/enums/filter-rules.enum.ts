export enum FilterRules {
	EQUALS = 'eq',
	CONTAINS = 'contains',
	STARTS_WITH = 'startsWith',
	ENDS_WITH = 'endsWith',
	IN = 'in',
	NOT_IN = 'notIn',
	GREATER_THAN = 'gt',
	GREATER_THAN_OR_EQUALS = 'gte',
	LESS_THAN = 'lt',
	LESS_THAN_OR_EQUALS = 'lte',

	// CUSTOM RULES

	LIKE = 'like',
}
