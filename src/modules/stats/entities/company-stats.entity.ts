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

	constructor(data: Partial<CompanyStatsEntity>) {
		Object.assign(this, data)
	}
}
