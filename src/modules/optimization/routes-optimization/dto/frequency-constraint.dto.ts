import { protos } from '@googlemaps/routeoptimization'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { DurationDto } from './duration.dto'

export class FrequencyConstraintDto
	implements
		protos.google.maps.routeoptimization.v1.BreakRule.IFrequencyConstraint
{
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => DurationDto)
	@ApiProperty()
	maxInterBreakDuration: DurationDto

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => DurationDto)
	@ApiProperty()
	minBreakDuration: DurationDto
}
