import { ApiProperty } from '@nestjs/swagger'

export class PaginationMetadataEntity {
	@ApiProperty()
	total: number

	@ApiProperty()
	page: number

	@ApiProperty()
	lastPage: number
}
