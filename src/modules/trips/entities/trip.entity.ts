import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Prisma, Trip } from '@prisma/client'
import { RouteEntity } from 'src/modules/optimization/routes/entities'

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
	origin: string

	@ApiProperty()
	destination: string

	@ApiProperty()
	departureTime: Date

	@ApiProperty()
	arrivalTime: Date

	@ApiProperty()
	totalDistance: number

	@ApiProperty()
	totalDuration: number

	@ApiProperty()
	criteria: Prisma.JsonValue

	@ApiPropertyOptional({ type: RouteEntity, isArray: true })
	results: RouteEntity[]

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	constructor(partial: Partial<TripEntity>) {
		Object.assign(this, partial)
	}
}
