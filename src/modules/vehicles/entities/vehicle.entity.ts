import { ApiProperty } from '@nestjs/swagger'
import { Vehicle } from '@prisma/client'

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

	createdAt: Date
	updatedAt: Date
}
