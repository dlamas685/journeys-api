import { ApiProperty } from '@nestjs/swagger'
import { FavoritePlace } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { Transform } from 'class-transformer'
import { transformToNumber } from 'src/common/helpers'

export class FavoritePlaceEntity implements FavoritePlace {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	placeId: string

	@ApiProperty({ type: Number })
	@Transform(transformToNumber)
	latitude: Decimal

	@ApiProperty({ type: Number })
	@Transform(transformToNumber)
	longitude: Decimal

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
