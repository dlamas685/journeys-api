import { ApiProperty } from '@nestjs/swagger'
import { PaginationMetadataEntity } from './pagination-metadata.entity'

export class PaginatedResponseEntity<T = any> {
	@ApiProperty()
	meta: PaginationMetadataEntity

	data: T[]

	constructor(data: T[], meta: PaginationMetadataEntity) {
		this.meta = meta
		this.data = data
	}
}
