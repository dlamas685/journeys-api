import { ApiProperty } from '@nestjs/swagger'
import { FavoritePlace } from '@prisma/client'
import { LocationEntity } from 'src/common/entities'

export class FavoritePlaceEntity implements FavoritePlace {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

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

	@ApiProperty()
	types: string[]

	constructor(partial: Partial<FavoritePlaceEntity>) {
		Object.assign(this, partial)
	}
}
