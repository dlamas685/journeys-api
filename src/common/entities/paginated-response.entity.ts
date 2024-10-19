import { ApiProperty } from '@nestjs/swagger'

export class PaginationMetadataEntity {
	@ApiProperty()
	total: number

	@ApiProperty()
	page: number

	@ApiProperty()
	lastPage: number
}

export class PaginatedResponseEntity<T> {
	@ApiProperty({
		type: [Object],
		description: 'Array of objects that represent the data',
	})
	data: T[]

	@ApiProperty()
	meta: PaginationMetadataEntity

	constructor(data: T[], meta: PaginationMetadataEntity) {
		this.data = data
		this.meta = meta
	}
}
