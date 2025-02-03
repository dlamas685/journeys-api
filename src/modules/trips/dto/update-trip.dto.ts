import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import { JsonValue } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { CriteriaDto } from 'src/modules/optimization/routes/dto'
import { CreateTripDto } from './create-trip.dto'

export class UpdateTripDto extends PartialType(
	OmitType(CreateTripDto, ['criteria', 'post'])
) {
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CriteriaDto)
	@ApiPropertyOptional({ type: CriteriaDto })
	criteria?: JsonValue
}
