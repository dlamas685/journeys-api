import { ApiProperty } from '@nestjs/swagger'

export class CompanyStatsEntity {
	@ApiProperty()
	total: number

	@ApiProperty()
	totalUpcoming: number

	@ApiProperty()
	totalOngoing: number

	@ApiProperty()
	totalCompleted: number

	@ApiProperty()
	totalDismissed: number
}

export class CompanyStatsByMonthEntity {
	@ApiProperty()
	year: number

	@ApiProperty()
	month: number

	@ApiProperty()
	countCompleted: number
}

export class TopDriversEntity {
	name: string
	countCompleted: number
}
