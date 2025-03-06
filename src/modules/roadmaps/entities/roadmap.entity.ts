import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Roadmap, RoadmapStatus } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'
import { SettingDto } from 'src/modules/optimization/routes-optimization/dtos'
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
	startDateTime: Date

	@ApiProperty()
	endDateTime: Date

	@ApiProperty({ enum: RoadmapStatus })
	status: RoadmapStatus

	@ApiProperty({ type: SettingDto })
	setting: JsonObject

	@ApiPropertyOptional({ type: RoadmapOptimizationEntity })
	results: JsonObject | null

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	constructor(partial: Partial<RoadmapEntity>) {
		Object.assign(this, partial)
	}
}
