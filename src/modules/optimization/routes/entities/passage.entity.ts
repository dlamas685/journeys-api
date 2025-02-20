import { ApiProperty } from '@nestjs/swagger'
import { LocationEntity } from 'src/common/entities'
import { LocationDto } from '../dtos'

export class PassageEntity {
	@ApiProperty()
	address: string

	@ApiProperty({ type: LocationEntity })
	location: LocationEntity

	@ApiProperty()
	placeId: string

	constructor() {
		this.location = new LocationEntity()
	}
}

export class PassageEntityBuilder {
	private passage: PassageEntity

	constructor() {
		this.passage = new PassageEntity()
	}

	setAddress(address: string): PassageEntityBuilder {
		this.passage.address = address
		return this
	}

	setLocation(location: LocationDto): PassageEntityBuilder {
		this.passage.location.latitude = location.latitude
		this.passage.location.longitude = location.longitude
		return this
	}

	setPlaceId(placeId: string): PassageEntityBuilder {
		this.passage.placeId = placeId
		return this
	}

	build(): PassageEntity {
		return this.passage
	}
}
