import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class TransitionEntity {
	@ApiProperty()
	travelDuration: number

	@ApiProperty()
	travelDistanceMeters: number

	@ApiProperty()
	totalDuration: number

	@ApiProperty()
	startTime: string

	@ApiPropertyOptional()
	encodedPolyline: string

	@ApiPropertyOptional()
	token: string
}
