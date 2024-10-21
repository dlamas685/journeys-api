import { ApiProperty } from '@nestjs/swagger'

export class PaginationMetadataEntity {
	@ApiProperty()
	total: number

	@ApiProperty()
	page: number

	@ApiProperty()
	lastPage: number
}

export class PaginatedResponseEntity<T = any> {
	@ApiProperty()
	meta: PaginationMetadataEntity

	data: T[]

	constructor(data: T[], meta: PaginationMetadataEntity) {
		this.meta = meta
		this.data = data
	}
}
