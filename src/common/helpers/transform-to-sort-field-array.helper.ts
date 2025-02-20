import { BadRequestException } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { SortFieldDto } from '../dtos'

export const transformToSortFieldArray = value =>
	value.map(filter => {
		const parts = filter.split(':')
		if (parts.length !== 2) {
			throw new BadRequestException('Formato de ordenamiento inválido')
		}
		const [field, direction] = parts

		return plainToClass(SortFieldDto, { field, direction })
	})
