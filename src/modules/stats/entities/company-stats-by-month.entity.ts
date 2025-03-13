import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

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
