import { protos } from '@googlemaps/routeoptimization'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { BreakRequestDto } from './break-request.dto'
import { FrequencyConstraintDto } from './frequency-constraint.dto'

export class BreakRuleDto
	implements protos.google.maps.routeoptimization.v1.IBreakRule
{
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => BreakRequestDto)
	@ApiPropertyOptional()
	breakRequests?: BreakRequestDto[]

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => FrequencyConstraintDto)
	@ApiPropertyOptional()
	frequencyConstraints?: FrequencyConstraintDto[]
}
