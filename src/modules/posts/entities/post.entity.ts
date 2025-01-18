import { ApiProperty } from '@nestjs/swagger'
import { Post, PostStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { Transform } from 'class-transformer'
import { transformToNumber } from 'src/common/helpers'

export class PostEntity implements Post {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	tripId: string

	@ApiProperty({ enum: PostStatus, type: PostEntity })
	postStatus: PostStatus

	@ApiProperty()
	isPublic: boolean

	@ApiProperty()
	destination: string

	@ApiProperty()
	cityTown: string

	@ApiProperty()
	carrierName: string

	@ApiProperty()
	carrierPhone: string

	@ApiProperty({ type: Number })
	@Transform(transformToNumber)
	pricePerKg: Decimal | null

	@ApiProperty({ type: Number })
	@Transform(transformToNumber)
	pricePerPostal: Decimal | null

	@ApiProperty()
	maxCapacityKg: number | null

	@ApiProperty()
	currentFillingKg: number | null

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	constructor(partial: Partial<PostEntity>) {
		Object.assign(this, partial)
	}
}
