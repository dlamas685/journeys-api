import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ActivityEntity } from 'src/modules/activity-templates/entities'
import { v4 as uuid } from 'uuid'
import { AdvancedWaypointActivityDto, LocationDto } from '../dto'
import { LocationEntity } from './location.entity'

export class StopEntity {
	@ApiProperty()
	address: string

	@ApiProperty({ type: LocationEntity })
	location: LocationEntity

	@ApiProperty()
	placeId: string

	@ApiPropertyOptional({ type: [ActivityEntity] })
	activities: ActivityEntity[]

	@ApiProperty()
	duration: number

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

	setAddress(address: string): StopEntityBuilder {
		this.stop.address = address
		return this
	}

	setLocation(location: LocationDto): StopEntityBuilder {
		this.stop.location.latitude = location.latitude
		this.stop.location.longitude = location.longitude
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
		return this
	}

	setDuration(activities: AdvancedWaypointActivityDto[]): StopEntityBuilder {
		this.stop.duration = activities.reduce(
			(acc, activity) => acc + activity.duration,
			0
		)
		return this
	}

	build(): StopEntity {
		return this.stop
	}
}
