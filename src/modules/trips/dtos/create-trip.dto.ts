import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { JsonObject } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import {
	IsBoolean,
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	ValidateNested,
} from 'class-validator'
import { CriteriaDto } from 'src/modules/optimization/routes/dtos'

export class CreateTripDto {
	@IsBoolean()
	@IsOptional()
	isArchived?: boolean

	@IsNotEmpty()
	@ApiProperty()
	code: string

	@IsNotEmpty()
	@ApiProperty()
	origin: string

	@IsNotEmpty()
	@ApiProperty()
	destination: string

	@IsDateString()
	@ApiProperty({ type: Date })
	departureTime: Date

	@IsOptional()
	@IsDateString()
	@ApiPropertyOptional({ type: Date })
	arrivalTime: Date

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	@ApiPropertyOptional()
	totalDistance?: number

	@IsOptional()
	@IsInt()
	@IsPositive()
	@ApiPropertyOptional()
	totalDuration?: number

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CriteriaDto)
	@ApiProperty({ type: CriteriaDto })
	criteria: JsonObject
}
