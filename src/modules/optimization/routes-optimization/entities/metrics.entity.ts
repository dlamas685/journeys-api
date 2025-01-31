import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class MetricsEntity {
	@ApiProperty()
	performedServiceCount: number

	@ApiProperty()
	travelDuration: number

	@ApiProperty()
	visitDuration: number

	@ApiProperty()
	travelDistanceMeters: number

	@ApiPropertyOptional()
	totalFixedCost?: number

	@ApiPropertyOptional()
	totalCostPerHour?: number

	@ApiPropertyOptional()
	totalCostPerKilometer?: number

	@ApiPropertyOptional()
	totalCostPerTraveledHour?: number

	@ApiProperty()
	totalCost: number
}
