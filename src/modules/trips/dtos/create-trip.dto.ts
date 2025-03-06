import { ApiProperty } from '@nestjs/swagger'
import { JsonObject } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import {
	IsBoolean,
	IsDateString,
	IsNotEmpty,
	IsOptional,
	ValidateNested,
} from 'class-validator'
import { CriteriaDto } from 'src/modules/optimization/routes/dtos'

export class CreateTripDto {
	@IsNotEmpty()
	@ApiProperty()
	code: string

	@IsDateString()
	@ApiProperty({ type: Date })
	departureTime: Date

	@IsBoolean()
	@IsOptional()
	isArchived?: boolean

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CriteriaDto)
	@ApiProperty({ type: CriteriaDto })
	criteria: JsonObject
}
