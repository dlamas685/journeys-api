import { protos } from '@googlemaps/routing'
import { ApiProperty } from '@nestjs/swagger'
import { Speed } from '../enums'
import { LocationEntity } from './location.entity'
import { MoneyEntity } from './money.entity'
import { RouteLegLocalizedValuesEntity } from './route-leg-localized-values.entity'
import { RouteLegTravelAdvisoryEntity } from './route-leg-travel-advisory.entity'
import { StepEntity, StepEntityBuilder } from './step.entity'

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

	setDuration(
		duration: protos.google.protobuf.IDuration,
		staticDuration: protos.google.protobuf.IDuration
	): LegEntityBuilder {
		this.leg.duration = Number(duration.seconds)
		this.leg.staticDuration = Number(staticDuration.seconds)
		return this
	}

	setPolyline(encodedPolyline: string): LegEntityBuilder {
		this.leg.encodedPolyline = encodedPolyline
		return this
	}

	setStartLocation(
		location: protos.google.maps.routing.v2.ILocation
	): LegEntityBuilder {
		this.leg.startLocation.latitude = location.latLng.latitude
		this.leg.startLocation.longitude = location.latLng.longitude
		return this
	}

	setEndLocation(
		location: protos.google.maps.routing.v2.ILocation
	): LegEntityBuilder {
		this.leg.endLocation.latitude = location.latLng.latitude
		this.leg.endLocation.longitude = location.latLng.longitude
		return this
	}

	setLocalizedValues(
		localizedValues: protos.google.maps.routing.v2.RouteLegStep.IRouteLegStepLocalizedValues
	): LegEntityBuilder {
		this.leg.localizedValues.distance = localizedValues.distance.text
		this.leg.localizedValues.staticDuration =
			localizedValues.staticDuration.text
		return this
	}

	setTravelAdvisory(
		travelAdvisory: protos.google.maps.routing.v2.IRouteTravelAdvisory
	): LegEntityBuilder {
		if (travelAdvisory.tollInfo) {
			const estimatedPrice = travelAdvisory.tollInfo.estimatedPrice.map(
				price =>
					new MoneyEntity({
						currencyCode: price.currencyCode,
						units: price.units.toString(),
						nanos: price.nanos,
					})
			)

			this.leg.travelAdvisory.tollInfo.estimatedPrice = estimatedPrice
		}

		this.leg.travelAdvisory.speedReadingIntervals =
			travelAdvisory.speedReadingIntervals?.map(interval => ({
				startPolylinePointIndex: interval.startPolylinePointIndex,
				endPolylinePointIndex: interval.endPolylinePointIndex,
				speed: interval.speed as Speed,
			}))

		return this
	}

	setSteps(
		steps: protos.google.maps.routing.v2.IRouteLegStep[]
	): LegEntityBuilder {
		this.leg.steps = steps.map(step => {
			const newStep = new StepEntityBuilder()
				.setPolyline(step.polyline.encodedPolyline)
				.setStartLocation(step.startLocation)
				.setEndLocation(step.endLocation)
				.setNavigationInstruction(step.navigationInstruction)
				.setLocalizedValues(step.localizedValues)
				.setTravelAdvisory(step.travelAdvisory)
				.build()

			return newStep
		})

		return this
	}

	build(): LegEntity {
		return this.leg
	}
}
