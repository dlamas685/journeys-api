import { ApiProperty } from '@nestjs/swagger'
import { Driver } from '@prisma/client'
import { FleetEntity } from 'src/modules/fleets/entities/fleet.entity'

export class DriverEntity implements Driver {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	fleetId: string | null

	@ApiProperty()
	licenseNumber: string

	@ApiProperty()
	name: string

	@ApiProperty()
	imageUrl: string | null

	@ApiProperty()
	notes: string | null

	@ApiProperty({ type: FleetEntity })
	fleet: FleetEntity | null

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null
}
