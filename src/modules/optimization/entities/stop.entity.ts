import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CreateActivityDto } from 'src/modules/activity-templates/dto'
import { ActivityEntity } from 'src/modules/activity-templates/entities'
import { v4 as uuid } from 'uuid'
import { LocationDto } from '../dto'
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
		this.stop.location.latitude = location.latLng.latitude
		this.stop.location.longitude = location.latLng.longitude
		return this
	}

	setPlaceId(placeId: string): StopEntityBuilder {
		this.stop.placeId = placeId
		return this
	}

	setActivities(activities: CreateActivityDto[]): StopEntityBuilder {
		this.stop.activities = activities.map(activity => ({
			id: uuid(),
			name: activity.name,
			duration: activity.duration,
			description: activity.description,
		}))
		return this
	}

	setDuration(activities: CreateActivityDto[]): StopEntityBuilder {
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
