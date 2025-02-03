import { ApiProperty } from '@nestjs/swagger'
import { CostProfile } from '../enums/cost-profile.enum'

export class CostProfileEntity {
	@ApiProperty()
	id: CostProfile

	@ApiProperty()
	name: string

	@ApiProperty()
	description: string

	@ApiProperty()
	costPerKilometer: number

	@ApiProperty()
	costPerHour: number

	@ApiProperty()
	costPerTraveledHour: number

	@ApiProperty()
	fixedCost: number

	@ApiProperty()
	travelDurationMultiple: number
}
