import { ApiProperty } from '@nestjs/swagger'
import { FavoritePlace } from '@prisma/client'

export class FavoritePlaceEntity implements FavoritePlace {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

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
	name: string

	@ApiProperty()
	address: string

	@ApiProperty()
	types: string[]

	constructor(partial: Partial<FavoritePlaceEntity>) {
		Object.assign(this, partial)
	}
}
