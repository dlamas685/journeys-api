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
}

export class StatsByMonthEntity {
	@ApiProperty()
	@Expose()
	year: number

	@ApiProperty()
	@Expose()
	month: number

	@ApiProperty()
	@Expose()
	countArchived: number
}
