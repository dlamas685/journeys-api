import { BadRequestException } from '@nestjs/common'
import { plainToClass, TransformFnParams } from 'class-transformer'
import { FilterFieldDto } from '../dto'
import { FilterRules, FilterTypes } from '../enums'

export const transformToFilterFieldArray = ({ value }: TransformFnParams) =>
	value.map(filter => {
		const parts = filter.match(/([^:]+):([^:]+):([^:]+):(.+)/)?.slice(1)

		if (!parts || parts.length < 4) {
			throw new BadRequestException(
				'Formato de filtro inválido, se esperan exactamente 4 partes separadas por ":" (field:rule:type:value)'
			)
		}

		const [field, rule, type, value] = parts

		const isNot = rule.startsWith('!')
		const isInsensitive = rule.endsWith('~')

		if (isInsensitive && type !== FilterTypes.STRING) {
			throw new BadRequestException(
				'La regla "~" solo puede ser aplicada a campos de tipo string'
			)
		}

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
			isInsensitive: type === FilterTypes.STRING ? isInsensitive : undefined,
			type,
		})
	})
