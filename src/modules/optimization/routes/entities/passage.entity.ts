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

	@ApiProperty()
	name: string

	constructor() {
		this.location = new LocationEntity()
	}
}

export class PassageEntityBuilder {
	private passage: PassageEntity

	constructor() {
		this.passage = new PassageEntity()
	}

	setName(name: string): PassageEntityBuilder {
		this.passage.name = name
		return this
	}

	setAddress(address: string): PassageEntityBuilder {
		this.passage.address = address
		return this
	}

	setLocation(location: LocationDto): PassageEntityBuilder {
		this.passage.location = location
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
