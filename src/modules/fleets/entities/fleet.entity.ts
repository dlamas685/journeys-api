import { ApiProperty } from '@nestjs/swagger'
import { Fleet } from '@prisma/client'

export class FleetEntity implements Fleet {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	name: string

	@ApiProperty()
	description: string | null

	@ApiProperty()
	maxVehicles: number | null

	@ApiProperty()
	maxDrivers: number | null

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	constructor(partial: Partial<FleetEntity>) {
		Object.assign(this, partial)
	}
}
