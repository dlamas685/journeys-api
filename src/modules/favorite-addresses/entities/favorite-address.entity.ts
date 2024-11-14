import { ApiProperty } from '@nestjs/swagger'
import { FavoriteAddress } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { Transform } from 'class-transformer'
import { transformToNumber } from 'src/common/helpers'

export class FavoriteAddressEntity implements FavoriteAddress {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	alias: string

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
	address: string

	constructor(partial: Partial<FavoriteAddressEntity>) {
		Object.assign(this, partial)
	}
}
