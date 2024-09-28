import { ApiProperty } from '@nestjs/swagger'
import { FavoriteAddress } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'

export class DecimalNumber extends Decimal {
	constructor(value?: any) {
		super(value || 0)
	}
}

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
	@Type(() => DecimalNumber)
	latitude: DecimalNumber | null

	@ApiProperty()
	@Type(() => DecimalNumber)
	longitude: DecimalNumber | null

	createdAt: Date
	updatedAt: Date | null

	constructor(partial: Partial<FavoriteAddressEntity>) {
		Object.assign(this, partial)
	}
}
