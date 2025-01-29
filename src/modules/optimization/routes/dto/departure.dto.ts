import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, Matches } from 'class-validator'
import { TIME_PATTERN } from 'src/common/constants'

export class DepartureDto {
	@IsNotEmpty()
	@IsDateString()
	@ApiProperty()
	date: string

	@IsNotEmpty()
	@Matches(TIME_PATTERN)
	@ApiProperty()
	time: string
}
