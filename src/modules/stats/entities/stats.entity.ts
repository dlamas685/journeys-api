import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class StatsEntity {
	@ApiProperty()
	@Expose()
	total: number

	@ApiProperty()
	@Expose()
	totalArchived: number

	@ApiProperty()
	@Expose()
	totalNoArchived: number

	constructor(data: Partial<StatsEntity>) {
		Object.assign(this, data)
	}
}
