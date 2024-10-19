import { ApiProperty } from '@nestjs/swagger'

export class PaginationMetadataEntity {
	@ApiProperty()
	total: number

	@ApiProperty()
	page: number

	@ApiProperty()
	lastPage: number
}

export class PaginatedResponseEntity {
	@ApiProperty()
	meta: PaginationMetadataEntity

	constructor(meta: PaginationMetadataEntity) {
		this.meta = meta
	}
}
