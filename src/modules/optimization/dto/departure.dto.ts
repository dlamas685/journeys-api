import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsString, Matches } from 'class-validator'
import { TIME_PATTERN } from 'src/common/constants'

export class DepartureDto {
	@IsDateString()
	@ApiProperty()
	date: string

	@IsString()
	@Matches(TIME_PATTERN)
	@ApiProperty()
	time: string

	constructor(partial: Partial<DepartureDto>) {
		Object.assign(this, partial)
	}
}
