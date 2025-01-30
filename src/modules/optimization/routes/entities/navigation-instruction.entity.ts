import { ApiProperty } from '@nestjs/swagger'
import { Maneuver } from '../enums'

export class NavigationInstructionEntity {
	@ApiProperty({ enum: Maneuver, nullable: true })
	maneuver: Maneuver | null

	@ApiProperty({ nullable: true })
	instructions: string | null
}
