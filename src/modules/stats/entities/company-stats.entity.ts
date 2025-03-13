import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class CompanyStatsEntity {
	@ApiProperty()
	@Expose()
	total: number

	@ApiProperty()
	@Expose()
	totalUpcoming: number

	@ApiProperty()
	@Expose()
	totalOngoing: number

	@ApiProperty()
	@Expose()
	totalCompleted: number

	@ApiProperty()
	@Expose()
	totalDismissed: number
}

export class CompanyStatsByMonthEntity {
	@ApiProperty()
	@Expose()
	year: number

	@ApiProperty()
	@Expose()
	month: number

	@ApiProperty()
	@Expose()
	countCompleted: number
}

export class TopDriversEntity {
	@ApiProperty()
	@Expose()
	name: string

	@ApiProperty()
	@Expose()
	countCompleted: number
}
