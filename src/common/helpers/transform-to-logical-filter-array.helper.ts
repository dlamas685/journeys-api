import { BadRequestException } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { FilterFieldDto, LogicalFilterDto } from '../dto'
import { FilterRules } from '../enums'

export const transformToLogicalFilterArray = value =>
	value
		.map(filter => {
			const parts = filter.split(':')
			if (parts.length < 3 || parts.length > 5) {
				throw new BadRequestException(
					'Formato de filtro lógico inválido, se esperan 3 a 5 partes separadas por ":" (operator:field:rule:type:value)'
				)
			}

			const [operator, field, rule, type, value] = parts

			const isNot = !!rule.startsWith('!')

			const isInsensitive = !!rule.endsWith('~')

			const newRule = rule.slice(isNot ? 1 : 0, isInsensitive ? -1 : undefined)

			const newValue =
				newRule === FilterRules.IN || newRule === FilterRules.NOT_IN
					? value.split('/')
					: value

			return {
				operator,
				field,
				rule: newRule,
				type,
				value: newValue,
				isNot,
				isInsensitive,
			}
		})
		.reduce((acc, curr) => {
			const index = acc.findIndex(item => item.operator === curr.operator)
			if (index === -1) {
				acc.push({
					operator: curr.operator,
					conditions: [
						plainToClass(FilterFieldDto, {
							field: curr.field,
							rule: curr.rule,
							value: curr.value,
							type: curr.type,
							isInsensitive: curr.isInsensitive,
							isNot: curr.isNot,
						}),
					],
				})
			} else {
				acc[index].conditions.push(
					plainToClass(FilterFieldDto, {
						field: curr.field,
						rule: curr.rule,
						value: curr.value,
						type: curr.type,
						isInsensitive: curr.isInsensitive,
						isNot: curr.isNot,
					})
				)
			}
			return acc
		}, [])
		.map(logicalFilter => plainToClass(LogicalFilterDto, logicalFilter))
