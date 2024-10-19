import { ApiProperty } from '@nestjs/swagger'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities/paginated-response.entity'
import { FavoriteAddressEntity } from './favorite-address.entity'

export class FavoriteAddressPaginatedResponseEntity extends PaginatedResponseEntity {
	@ApiProperty({ isArray: true, type: FavoriteAddressEntity })
	data: FavoriteAddressEntity[]

	constructor(data: FavoriteAddressEntity[], meta: PaginationMetadataEntity) {
		super(meta)
		this.data = data
	}
}
