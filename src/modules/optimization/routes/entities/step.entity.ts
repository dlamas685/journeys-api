import { ApiProperty } from '@nestjs/swagger'
import { LocationEntity } from 'src/common/entities'
import { NavigationInstructionEntity } from './navigation-instruction.entity'
import { RouteLegStepLocalizedValues } from './route-leg-step-localized-values.entity'
import { RouteLegStepTravelAdvisory } from './route-leg-step-travel-advisory.entity'

export class StepEntity {
	@ApiProperty()
	distance: number

	@ApiProperty()
	staticDuration: number

	@ApiProperty()
	encodedPolyline: string

	@ApiProperty({ type: LocationEntity })
	startLocation: LocationEntity

	@ApiProperty({ type: LocationEntity })
	endLocation: LocationEntity

	@ApiProperty({ type: NavigationInstructionEntity })
	navigationInstruction: NavigationInstructionEntity | null

	@ApiProperty({ type: RouteLegStepLocalizedValues })
	localizedValues: RouteLegStepLocalizedValues

	@ApiProperty({ type: RouteLegStepTravelAdvisory })
	travelAdvisory: RouteLegStepTravelAdvisory | null

	constructor() {
		this.startLocation = new LocationEntity()
		this.endLocation = new LocationEntity()
		this.localizedValues = new RouteLegStepLocalizedValues()
		this.travelAdvisory = new RouteLegStepTravelAdvisory()
		this.navigationInstruction = new NavigationInstructionEntity()
	}
}

export class StepEntityBuilder {
	private step: StepEntity

	constructor() {
		this.step = new StepEntity()
	}

	setDistance(distance: number): StepEntityBuilder {
		this.step.distance = distance
		return this
	}

	setDuration(staticDuration: number): StepEntityBuilder {
		this.step.staticDuration = staticDuration
		return this
	}

	setPolyline(encodedPolyline: string): StepEntityBuilder {
		this.step.encodedPolyline = encodedPolyline
		return this
	}

	setStartLocation(location: LocationEntity): StepEntityBuilder {
		this.step.startLocation.latitude = location.latitude
		this.step.startLocation.longitude = location.longitude
		return this
	}

	setEndLocation(location: LocationEntity): StepEntityBuilder {
		this.step.endLocation.latitude = location.latitude
		this.step.endLocation.longitude = location.longitude
		return this
	}

	setNavigationInstruction(
		navigationInstruction: NavigationInstructionEntity
	): StepEntityBuilder {
		this.step.navigationInstruction = navigationInstruction
		return this
	}

	setLocalizedValues(
		localizedValues: RouteLegStepLocalizedValues
	): StepEntityBuilder {
		this.step.localizedValues = localizedValues
		return this
	}

	setTravelAdvisory(
		travelAdvisory: RouteLegStepTravelAdvisory
	): StepEntityBuilder {
		this.step.travelAdvisory = travelAdvisory
		return this
	}

	build(): StepEntity {
		return this.step
	}
}
