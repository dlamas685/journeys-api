import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { formatTime } from 'src/common/helpers'
import { v4 as uuid } from 'uuid'
import { RouteLabel } from '../enums'
import { LegEntity } from './leg.entity'
import { LocalizedValuesEntity } from './localized-values.entity'
import { PassageEntity } from './passage.entity'
import { StopEntity } from './stop.entity'
import { TravelAdvisoryEntity } from './travel-advisory.entity'

export class RouteEntity {
	@ApiProperty()
	id: string

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
		this.route.id = uuid()
	}

	setDistance(distance: number): RouteEntityBuilder {
		this.route.distance = distance
		return this
	}

	setDuration(duration: number, staticDuration: number): RouteEntityBuilder {
		this.route.duration = duration
		this.route.staticDuration = staticDuration
		return this
	}

	setPolyline(encodedPolyline: string): RouteEntityBuilder {
		this.route.encodedPolyline = encodedPolyline
		return this
	}

	setLabels(routeLabels: RouteLabel[]): RouteEntityBuilder {
		this.route.routeLabels = routeLabels
		return this
	}

	setTravelAdvisory(travelAdvisory: TravelAdvisoryEntity): RouteEntityBuilder {
		this.route.travelAdvisory = travelAdvisory
		return this
	}

	setLocalizedValues(
		localizedValues: LocalizedValuesEntity
	): RouteEntityBuilder {
		this.route.localizedValues = localizedValues
		return this
	}

	setLegs(legs: LegEntity[]): RouteEntityBuilder {
		this.route.legs = legs
		return this
	}

	setLeg(leg: LegEntity) {
		this.route.legs.push(leg)
		return this
	}

	setStops(stops: StopEntity[]): RouteEntityBuilder {
		this.route.stops = stops

		const stopsDuration = this.route.stops.reduce(
			(acc, stop) => acc + stop.duration,
			0
		)

		this.route.duration += stopsDuration

		this.route.staticDuration += stopsDuration

		this.route.localizedValues.duration = formatTime(this.route.duration)

		this.route.localizedValues.staticDuration = formatTime(this.route.duration)

		return this
	}

	setStop(stop: StopEntity): RouteEntityBuilder {
		this.route.stops.push(stop)

		this.route.duration += stop.duration

		this.route.staticDuration += stop.duration

		this.route.localizedValues.duration = formatTime(this.route.duration)

		this.route.localizedValues.staticDuration = formatTime(this.route.duration)

		return this
	}

	setPassages(passages: PassageEntity[]): RouteEntityBuilder {
		this.route.passages = passages
		return this
	}

	setPassage(passage: PassageEntity): RouteEntityBuilder {
		this.route.passages.push(passage)
		return this
	}

	build(): RouteEntity {
		return this.route
	}
}
