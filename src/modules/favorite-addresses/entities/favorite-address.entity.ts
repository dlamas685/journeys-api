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
	address: string

	@ApiProperty()
	alias: string | null

	@ApiProperty()
	placeId: string | null

	@ApiProperty({ type: Number })
	@Transform(transformToNumber)
	latitude: Decimal | null

	@ApiProperty({ type: Number })
	@Transform(transformToNumber)
	longitude: Decimal | null

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	constructor(partial: Partial<FavoriteAddressEntity>) {
		Object.assign(this, partial)
	}
}
