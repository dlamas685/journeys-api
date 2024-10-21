import { BadRequestException } from '@nestjs/common'
import { plainToClass, TransformFnParams } from 'class-transformer'
import { FilterFieldDto } from '../dto'
import { FilterRules } from '../enums'

export const transformToFilterFieldArray = ({ value }: TransformFnParams) =>
	value.map(filter => {
		const parts = filter.split(':')
		if (parts.length < 2 || parts.length > 4) {
			throw new BadRequestException(
				'Formato de filtro inválido, se esperan 2 a 4 partes separadas por ":" (field:rule:type:value)'
			)
		}

		const [field, rule, type, value] = parts

		const isNot = !!rule.startsWith('!')

		const isInsensitive = !!rule.endsWith('~')

		const newRule = rule.slice(isNot ? 1 : 0, isInsensitive ? -1 : undefined)

		const newValue =
			newRule === FilterRules.IN || newRule === FilterRules.NOT_IN
				? value.split('/')
				: value

		return plainToClass(FilterFieldDto, {
			field,
			rule: newRule,
			value: newValue,
			isNot,
			isInsensitive,
			type,
		})
	})
