import { ApiProperty } from '@nestjs/swagger'
import { FavoriteAddress } from '@prisma/client'

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
	latitude: number

	@ApiProperty()
	longitude: number

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	@ApiProperty()
	address: string

	constructor(partial: Partial<FavoriteAddressEntity>) {
		Object.assign(this, partial)
	}
}
