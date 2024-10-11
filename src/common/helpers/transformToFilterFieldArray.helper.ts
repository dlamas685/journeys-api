import { BadRequestException } from '@nestjs/common'
import { plainToClass, TransformFnParams } from 'class-transformer'
import { FilterFieldDto } from '../dto'
import { FilterRules } from '../enums'
import { FilterModes } from '../enums/filter-modes.enum'

export const transformToFilterFieldArray = ({ value }: TransformFnParams) =>
	value.map(filter => {
		const parts = filter.split(':')
		if (parts.length < 2 || parts.length > 4) {
			throw new BadRequestException('Formato de filtro inválido')
		}

		const [field, rule, value, mode] = parts

		const isNot = rule.startsWith('!')

		const newRule = (isNot ? rule.slice(1) : rule) as FilterRules

		const newValue =
			newRule === FilterRules.IN || newRule === FilterRules.NOT_IN
				? value.split('/')
				: value

		return plainToClass(FilterFieldDto, {
			field,
			rule: newRule,
			value: newValue,
			isNot,
			mode: mode ?? FilterModes.INSENSITIVE,
		})
	})
