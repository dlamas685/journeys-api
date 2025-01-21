import { ApiProperty } from '@nestjs/swagger'

export class LocationEntity {
	@ApiProperty()
	latitude: number

	@ApiProperty()
	longitude: number
}
