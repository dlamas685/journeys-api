import { BadRequestException } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { FilterFieldDto, LogicalFilterDto } from '../dto'
import { FilterModes } from '../enums/filter-modes.enum'

export const transformToLogicalFilterArray = ({ value }) =>
	value
		.map(filter => {
			const parts = filter.split(':')
			if (parts.length < 3 || parts.length > 5) {
				throw new BadRequestException('Formato de filtro lógico inválido')
			}
			const [operator, field, rule, value, mode] = parts

			return { operator, field, rule, value, mode }
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
							mode: curr.mode ?? FilterModes.INSENSITIVE,
						}),
					],
				})
			} else {
				acc[index].conditions.push(
					plainToClass(FilterFieldDto, {
						field: curr.field,
						rule: curr.rule,
						value: curr.value,
						mode: curr.mode ?? FilterModes.INSENSITIVE,
					})
				)
			}
			return acc
		}, [])
		.map(logicalFilter => plainToClass(LogicalFilterDto, logicalFilter))
