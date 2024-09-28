import { ApiProperty } from '@nestjs/swagger'
import { FavoriteAddress } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export class FavoriteAddressEntity implements FavoriteAddress {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	address: string

	@ApiProperty()
	alias: string | null

	@ApiProperty()
	placeId: string | null

	@ApiProperty()
	latitude: Decimal | null

	@ApiProperty()
	longitude: Decimal | null

	createdAt: Date
	updatedAt: Date | null

	constructor(partial: Partial<FavoriteAddressEntity>) {
		Object.assign(this, partial)
	}
}
