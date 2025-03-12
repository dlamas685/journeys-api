import { ApiProperty } from '@nestjs/swagger'

export class StatsEntity {
	@ApiProperty()
	total: number

	@ApiProperty()
	totalArchived: number

	@ApiProperty()
	totalNoArchived: number
}

export class StatsByMonthEntity {
	@ApiProperty()
	year: number

	@ApiProperty()
	month: number

	@ApiProperty()
	countArchived: number
}
