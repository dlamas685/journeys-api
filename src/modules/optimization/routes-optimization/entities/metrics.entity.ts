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

export class MetricsEntityBuilder {
	private metrics: MetricsEntity

	constructor() {
		this.metrics = new MetricsEntity()
	}

	setPerformedServiceCount(performedServiceCount: number) {
		this.metrics.performedServiceCount = performedServiceCount
		return this
	}

	setTravelDuration(travelDuration: number) {
		this.metrics.travelDuration = travelDuration
		return this
	}

	setVisitDuration(visitDuration: number) {
		this.metrics.visitDuration = visitDuration
		return this
	}

	setTravelDistanceMeters(travelDistanceMeters: number) {
		this.metrics.travelDistanceMeters = travelDistanceMeters
		return this
	}

	setTotalFixedCost(totalFixedCost: number) {
		this.metrics.totalFixedCost = totalFixedCost
		return this
	}

	setTotalCostPerHour(totalCostPerHour: number) {
		this.metrics.totalCostPerHour = totalCostPerHour
		return this
	}

	setTotalCostPerKilometer(totalCostPerKilometer: number) {
		this.metrics.totalCostPerKilometer = totalCostPerKilometer
		return this
	}

	setTotalCostPerTraveledHour(totalCostPerTraveledHour: number) {
		this.metrics.totalCostPerTraveledHour = totalCostPerTraveledHour
		return this
	}

	setTotalCost(totalCost: number) {
		this.metrics.totalCost = totalCost
		return this
	}

	build() {
		return this.metrics
	}
}
