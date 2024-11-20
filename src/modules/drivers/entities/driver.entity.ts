import { ApiProperty } from '@nestjs/swagger'
import { Driver } from '@prisma/client'

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

	createdAt: Date
	updatedAt: Date
}
