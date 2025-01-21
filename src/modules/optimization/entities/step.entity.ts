import { protos } from '@googlemaps/routing'
import { ApiProperty } from '@nestjs/swagger'
import { Maneuver, Speed } from '../enums'
import { LocationEntity } from './location.entity'
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

	setDuration(
		staticDuration: protos.google.protobuf.IDuration
	): StepEntityBuilder {
		this.step.staticDuration = Number(staticDuration.seconds)
		return this
	}

	setPolyline(encodedPolyline: string): StepEntityBuilder {
		this.step.encodedPolyline = encodedPolyline
		return this
	}

	setStartLocation(
		location: protos.google.maps.routing.v2.ILocation
	): StepEntityBuilder {
		this.step.startLocation.latitude = location.latLng.latitude
		this.step.startLocation.longitude = location.latLng.longitude
		return this
	}

	setEndLocation(
		location: protos.google.maps.routing.v2.ILocation
	): StepEntityBuilder {
		this.step.endLocation.latitude = location.latLng.latitude
		this.step.endLocation.longitude = location.latLng.longitude
		return this
	}

	setNavigationInstruction(
		navigationInstruction: protos.google.maps.routing.v2.INavigationInstruction
	): StepEntityBuilder {
		this.step.navigationInstruction.instructions =
			navigationInstruction?.instructions

		this.step.navigationInstruction.maneuver =
			navigationInstruction?.maneuver as Maneuver
		return this
	}

	setLocalizedValues(
		localizedValues: protos.google.maps.routing.v2.RouteLegStep.IRouteLegStepLocalizedValues
	): StepEntityBuilder {
		this.step.localizedValues.distance = localizedValues.distance.text
		this.step.localizedValues.staticDuration =
			localizedValues.staticDuration.text
		return this
	}

	setTravelAdvisory(
		travelAdvisory: protos.google.maps.routing.v2.IRouteLegStepTravelAdvisory
	): StepEntityBuilder {
		this.step.travelAdvisory.speedReadingIntervals = travelAdvisory
			? travelAdvisory.speedReadingIntervals.map(interval => ({
					startPolylinePointIndex: interval.startPolylinePointIndex,
					endPolylinePointIndex: interval.endPolylinePointIndex,
					speed: interval.speed as Speed,
				}))
			: null

		return this
	}

	build(): StepEntity {
		return this.step
	}
}
