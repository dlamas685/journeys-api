import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

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

	@ApiProperty()
	@Expose()
	countNotArchived: number
}
