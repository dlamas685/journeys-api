import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Prisma, Roadmap, RoadmapStatus } from '@prisma/client'
import { RoadmapOptimizationEntity } from 'src/modules/optimization/routes-optimization/entities'

export class RoadmapEntity implements Roadmap {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	fleetId: string

	@ApiProperty()
	vehicleId: string

	@ApiProperty()
	driverId: string

	@ApiProperty()
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
	totalDistance: number | null

	@ApiProperty()
	totalDuration: number | null

	@ApiProperty({ enum: RoadmapStatus })
	status: RoadmapStatus

	@ApiProperty()
	setting: Prisma.JsonValue | null

	@ApiPropertyOptional({ type: RoadmapOptimizationEntity })
	results: RoadmapOptimizationEntity

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	constructor(partial: Partial<RoadmapEntity>) {
		Object.assign(this, partial)
	}
}
