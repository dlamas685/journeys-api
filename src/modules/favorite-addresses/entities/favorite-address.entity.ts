import { ApiProperty } from '@nestjs/swagger'
import { FavoriteAddress } from '@prisma/client'
import { LocationEntity } from 'src/common/entities'

export class FavoriteAddressEntity implements FavoriteAddress {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	alias: string

	@ApiProperty()
	placeId: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	@ApiProperty()
	name: string

	@ApiProperty({ type: LocationEntity })
	location: LocationEntity

	@ApiProperty()
	address: string

	constructor(partial: Partial<FavoriteAddressEntity>) {
		Object.assign(this, partial)
	}
}
