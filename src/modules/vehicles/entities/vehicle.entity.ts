import { ApiProperty } from '@nestjs/swagger'
import { Vehicle } from '@prisma/client'
import { FleetEntity } from 'src/modules/fleets/entities/fleet.entity'

export class VehicleEntity implements Vehicle {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	imageUrl: string | null

	@ApiProperty()
	fleetId: string | null

	@ApiProperty()
	licensePlate: string

	@ApiProperty()
	make: string | null

	@ApiProperty()
	model: string | null

	@ApiProperty()
	year: number | null

	@ApiProperty()
	vin: string | null

	@ApiProperty()
	notes: string | null

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	@ApiProperty({ type: FleetEntity })
	fleet: FleetEntity | null

	constructor(partial: Partial<VehicleEntity>) {
		Object.assign(this, partial)
	}
}
