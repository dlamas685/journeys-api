import { BadRequestException } from '@nestjs/common'

export const transformToSortFieldArray = (value: any) => {
	const arrayValue = typeof value === 'string' ? [value] : value

	return arrayValue.map(filter => {
		const parts = filter.split(':')
		if (parts.length !== 2) {
			throw new BadRequestException('Formato de ordenamiento inválido')
		}
		const [field, direction] = parts

		return { field, direction }
	})
}
