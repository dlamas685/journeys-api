import { protos } from '@googlemaps/routeoptimization'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { DurationDto } from './duration.dto'
import { TimestampDto } from './timestamp.dto'

export class BreakRequestDto
	implements protos.google.maps.routeoptimization.v1.BreakRule.IBreakRequest
{
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => TimestampDto)
	@ApiProperty()
	earliestStartTime: TimestampDto

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => TimestampDto)
	@ApiProperty()
	latestStartTime: TimestampDto

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => DurationDto)
	@ApiProperty()
	minDuration: DurationDto
}
