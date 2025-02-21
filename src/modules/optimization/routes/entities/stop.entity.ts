import { TZDate } from '@date-fns/tz'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { addSeconds } from 'date-fns/addSeconds'
import { TIME_ZONES } from 'src/common/constants'
import { LocationEntity } from 'src/common/entities'
import { ActivityEntity } from 'src/modules/activity-templates/entities'
import { v4 as uuid } from 'uuid'
import { AdvancedWaypointActivityDto, LocationDto } from '../dtos'

export class StopEntity {
	@ApiProperty()
	name: string

	@ApiProperty()
	address: string

	@ApiProperty({ type: LocationEntity })
	location: LocationEntity

	@ApiProperty()
	placeId: string

	@ApiPropertyOptional({ type: ActivityEntity, isArray: true })
	activities: ActivityEntity[]

	@ApiProperty()
	duration: number

	@ApiProperty()
	estimatedArrivalDateTimeWithTraffic: string

	@ApiProperty()
	estimatedDepartureDateTimeWithTraffic: string

	@ApiProperty()
	estimatedArrivalDateTimeWithoutTraffic: string

	@ApiProperty()
	estimatedDepartureDateTimeWithoutTraffic: string

	constructor() {
		this.location = new LocationEntity()
		this.activities = []
	}
}

export class StopEntityBuilder {
	private stop: StopEntity

	constructor() {
		this.stop = new StopEntity()
	}

	setName(name: string): StopEntityBuilder {
		this.stop.name = name
		return this
	}

	setAddress(address: string): StopEntityBuilder {
		this.stop.address = address
		return this
	}

	setLocation(location: LocationDto): StopEntityBuilder {
		this.stop.location = location
		return this
	}

	setPlaceId(placeId: string): StopEntityBuilder {
		this.stop.placeId = placeId
		return this
	}

	setActivities(activities: AdvancedWaypointActivityDto[]): StopEntityBuilder {
		this.stop.activities = activities.map(activity => ({
			id: uuid(),
			name: activity.name,
			duration: activity.duration,
			description: activity.description,
		}))

		this.stop.duration = activities.reduce(
			(acc, activity) => acc + activity.duration,
			0
		)
		return this
	}

	setDuration(duration: number): StopEntityBuilder {
		this.stop.duration = duration
		return this
	}

	setDateTime(
		startDateTimeWithTraffic: TZDate,
		startDateTimeWithoutTraffic: TZDate,
		duration: number,
		staticDuration: number
	): StopEntityBuilder {
		this.stop.estimatedArrivalDateTimeWithTraffic = addSeconds(
			startDateTimeWithTraffic,
			duration
		).toISOString()

		this.stop.estimatedDepartureDateTimeWithTraffic = addSeconds(
			new TZDate(this.stop.estimatedArrivalDateTimeWithTraffic, TIME_ZONES.AR),
			this.stop.duration
		).toISOString()

		this.stop.estimatedArrivalDateTimeWithoutTraffic = addSeconds(
			startDateTimeWithoutTraffic,
			staticDuration
		).toISOString()

		this.stop.estimatedDepartureDateTimeWithoutTraffic = addSeconds(
			new TZDate(
				this.stop.estimatedArrivalDateTimeWithoutTraffic,
				TIME_ZONES.AR
			),
			this.stop.duration
		).toISOString()

		return this
	}

	build(): StopEntity {
		return this.stop
	}
}
