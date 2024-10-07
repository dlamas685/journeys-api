import { ApiProperty } from '@nestjs/swagger'
import { FavoritePlace } from '@prisma/client'
import { Type } from 'class-transformer'
import { DecimalNumber } from '../../../modules/prisma/decimal-number.class'

export class FavoritePlaceEntity implements FavoritePlace {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	name: string

	@ApiProperty()
	placeId: string

	@ApiProperty()
	placeType: string

	@ApiProperty()
	@Type(() => DecimalNumber)
	latitude: DecimalNumber | null

	@ApiProperty()
	@Type(() => DecimalNumber)
	longitude: DecimalNumber | null

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date

	constructor(partial: Partial<FavoritePlaceEntity>) {
		Object.assign(this, partial)
	}
}
