import { ApiProperty } from '@nestjs/swagger'
import { Prisma, Trip, TripStatus } from '@prisma/client'

export class TripEntity implements Trip {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty({ enum: TripStatus, type: TripEntity })
	tripStatus: TripStatus

	@ApiProperty()
	origin: string

	@ApiProperty()
	destination: string

	@ApiProperty()
	departureTime: Date

	@ApiProperty()
	arrivalTime: Date

	@ApiProperty()
	distance: number | null

	@ApiProperty()
	duration: number | null

	@ApiProperty()
	presets: Prisma.JsonValue | null

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	constructor(partial: Partial<TripEntity>) {
		Object.assign(this, partial)
	}
}
