import { ApiProperty } from '@nestjs/swagger'
import { LocationEntity } from 'src/common/entities'
import { RouteLegLocalizedValuesEntity } from './route-leg-localized-values.entity'
import { RouteLegTravelAdvisoryEntity } from './route-leg-travel-advisory.entity'
import { StepEntity } from './step.entity'

export class LegEntity {
	@ApiProperty({ type: [StepEntity] })
	steps: StepEntity[]

	@ApiProperty()
	distance: number

	@ApiProperty()
	duration: number

	@ApiProperty()
	staticDuration: number

	@ApiProperty()
	encodedPolyline: string

	@ApiProperty({ type: LocationEntity })
	startLocation: LocationEntity

	@ApiProperty({ type: LocationEntity })
	endLocation: LocationEntity

	@ApiProperty({ type: RouteLegLocalizedValuesEntity })
	localizedValues: RouteLegLocalizedValuesEntity

	@ApiProperty({ type: RouteLegTravelAdvisoryEntity })
	travelAdvisory: RouteLegTravelAdvisoryEntity

	constructor() {
		this.steps = []
		this.startLocation = new LocationEntity()
		this.endLocation = new LocationEntity()
		this.localizedValues = new RouteLegLocalizedValuesEntity()
		this.travelAdvisory = new RouteLegTravelAdvisoryEntity()
	}
}

export class LegEntityBuilder {
	private leg: LegEntity

	constructor() {
		this.leg = new LegEntity()
	}

	setDistance(distance: number): LegEntityBuilder {
		this.leg.distance = distance
		return this
	}

	setDuration(duration: number, staticDuration: number): LegEntityBuilder {
		this.leg.duration = duration
		this.leg.staticDuration = staticDuration
		return this
	}

	setPolyline(encodedPolyline: string): LegEntityBuilder {
		this.leg.encodedPolyline = encodedPolyline
		return this
	}

	setStartLocation(location: LocationEntity): LegEntityBuilder {
		this.leg.startLocation.latitude = location.latitude
		this.leg.startLocation.longitude = location.longitude
		return this
	}

	setEndLocation(location: LocationEntity): LegEntityBuilder {
		this.leg.endLocation.latitude = location.latitude
		this.leg.endLocation.longitude = location.longitude
		return this
	}

	setLocalizedValues(
		localizedValues: RouteLegLocalizedValuesEntity
	): LegEntityBuilder {
		this.leg.localizedValues = localizedValues
		return this
	}

	setTravelAdvisory(
		travelAdvisory: RouteLegTravelAdvisoryEntity
	): LegEntityBuilder {
		this.leg.travelAdvisory = travelAdvisory
		return this
	}

	setSteps(steps: StepEntity[]): LegEntityBuilder {
		this.leg.steps = steps
		return this
	}

	setStep = (step: StepEntity): LegEntityBuilder => {
		this.leg.steps.push(step)
		return this
	}

	build(): LegEntity {
		return this.leg
	}
}
