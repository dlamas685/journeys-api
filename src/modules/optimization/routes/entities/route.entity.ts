import { protos } from '@googlemaps/routing'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { convertToHHMM, formatTimeShort } from 'src/common/helpers'
import { AdvancedWaypointDto } from '../dto'
import { RouteLabel, Speed } from '../enums'
import { LegEntity, LegEntityBuilder } from './leg.entity'
import { LocalizedValuesEntity } from './localized-values.entity'
import { MoneyEntity } from './money.entity'
import { PassageEntity, PassageEntityBuilder } from './passage.entity'
import { StopEntity, StopEntityBuilder } from './stop.entity'
import { TravelAdvisoryEntity } from './travel-advisory.entity'

export class RouteEntity {
	@ApiProperty({ type: [LegEntity] })
	legs: LegEntity[]

	@ApiProperty()
	optimizedIntermediateWaypointIndex?: number[] | null

	@ApiProperty({ enum: RouteLabel, isArray: true })
	routeLabels: RouteLabel[]

	@ApiProperty()
	distance: number

	@ApiProperty()
	duration: number

	@ApiProperty()
	staticDuration: number

	@ApiProperty()
	encodedPolyline: string

	@ApiProperty({ type: TravelAdvisoryEntity })
	travelAdvisory: TravelAdvisoryEntity

	@ApiProperty({ type: LocalizedValuesEntity })
	localizedValues: LocalizedValuesEntity

	@ApiPropertyOptional({ type: [StopEntity] })
	stops?: StopEntity[]

	@ApiPropertyOptional({ type: [PassageEntity] })
	passages?: PassageEntity[]

	constructor() {
		this.legs = []
		this.routeLabels = []
		this.travelAdvisory = new TravelAdvisoryEntity()
		this.localizedValues = new LocalizedValuesEntity()
		this.stops = []
		this.passages = []
	}
}

export class RouteEntityBuilder {
	private route: RouteEntity

	constructor() {
		this.route = new RouteEntity()
	}

	setDistance(distance: number): RouteEntityBuilder {
		this.route.distance = distance
		return this
	}

	setDuration(
		duration: protos.google.protobuf.IDuration,
		staticDuration: protos.google.protobuf.IDuration
	): RouteEntityBuilder {
		this.route.duration = Number(duration.seconds)
		this.route.staticDuration = Number(staticDuration.seconds)
		return this
	}

	setPolyline(encodedPolyline: string): RouteEntityBuilder {
		this.route.encodedPolyline = encodedPolyline
		return this
	}

	setLabels(
		routeLabels: protos.google.maps.routing.v2.RouteLabel[]
	): RouteEntityBuilder {
		this.route.routeLabels = routeLabels
		return this
	}

	setTravelAdvisory(
		travelAdvisory: protos.google.maps.routing.v2.IRouteTravelAdvisory
	): RouteEntityBuilder {
		if (travelAdvisory.tollInfo) {
			const estimatedPrice = travelAdvisory.tollInfo.estimatedPrice.map(
				price =>
					new MoneyEntity({
						currencyCode: price.currencyCode,
						units: price.units.toString(),
						nanos: price.nanos,
					})
			)

			this.route.travelAdvisory.tollInfo.estimatedPrice = estimatedPrice
		}

		this.route.travelAdvisory.fuelConsumptionMicroliters =
			travelAdvisory.fuelConsumptionMicroliters.toString()

		this.route.travelAdvisory.routeRestrictionsPartiallyIgnored =
			travelAdvisory.routeRestrictionsPartiallyIgnored

		this.route.travelAdvisory.speedReadingIntervals =
			travelAdvisory.speedReadingIntervals.map(interval => {
				return {
					startPolylinePointIndex: interval.startPolylinePointIndex,
					endPolylinePointIndex: interval.endPolylinePointIndex,
					speed: interval.speed as Speed,
				}
			})

		return this
	}

	setLocalizedValues(
		localizedValues: protos.google.maps.routing.v2.Route.IRouteLocalizedValues
	): RouteEntityBuilder {
		this.route.localizedValues.distance = localizedValues.distance.text
		this.route.localizedValues.duration = localizedValues.duration.text
		this.route.localizedValues.staticDuration =
			localizedValues.staticDuration.text
		return this
	}

	setLegs(legs: protos.google.maps.routing.v2.IRouteLeg[]): RouteEntityBuilder {
		this.route.legs = legs.map(leg => {
			return new LegEntityBuilder()
				.setDistance(leg.distanceMeters)
				.setDuration(leg.duration, leg.staticDuration)
				.setPolyline(leg.polyline.encodedPolyline)
				.setStartLocation(leg.startLocation)
				.setEndLocation(leg.endLocation)
				.setLocalizedValues(leg.localizedValues)
				.setTravelAdvisory(leg.travelAdvisory)
				.setSteps(leg.steps)
				.build()
		})

		return this
	}

	setStops(interestPoints: AdvancedWaypointDto[]): RouteEntityBuilder {
		this.route.stops = interestPoints
			.filter(intermediate => intermediate.vehicleStopover)
			.map(intermediate => {
				return new StopEntityBuilder()
					.setAddress(intermediate.address)
					.setLocation(intermediate.location)
					.setPlaceId(intermediate.placeId)
					.setActivities(intermediate.activities)
					.setDuration(intermediate.activities)
					.build()
			})

		const stopsDuration = this.route.stops.reduce(
			(acc, stop) => acc + stop.duration,
			0
		)

		this.route.duration += stopsDuration

		this.route.staticDuration += stopsDuration

		this.route.localizedValues.duration = formatTimeShort(
			convertToHHMM(this.route.duration)
		)

		this.route.localizedValues.staticDuration = formatTimeShort(
			convertToHHMM(this.route.staticDuration)
		)

		return this
	}

	setPassages(intermediates: AdvancedWaypointDto[]): RouteEntityBuilder {
		this.route.passages = intermediates
			.filter(intermediate => !intermediate.vehicleStopover)
			.map(intermediate => {
				return new PassageEntityBuilder()
					.setAddress(intermediate.address)
					.setLocation(intermediate.location)
					.setPlaceId(intermediate.placeId)
					.build()
			})

		return this
	}

	build(): RouteEntity {
		return this.route
	}
}
