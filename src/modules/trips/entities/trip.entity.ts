import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Trip } from '@prisma/client'
import { JsonArray, JsonObject } from '@prisma/client/runtime/library'

export class TripEntity implements Trip {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	isArchived: boolean = false

	@ApiProperty({ description: 'auto-generated value for easy search' })
	code: string

	@ApiProperty()
	departureTime: Date

	@ApiProperty()
	criteria: JsonObject

	@ApiPropertyOptional()
	results: JsonArray | null

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	constructor(partial: Partial<TripEntity>) {
		Object.assign(this, partial)
	}
}
