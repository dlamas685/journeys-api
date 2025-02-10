import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { JsonArray, JsonObject } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	ValidateNested,
} from 'class-validator'
import { CriteriaDto } from 'src/modules/optimization/routes/dto'
import { CreatePostFromTripDto } from 'src/modules/posts/dto'

export class CreateTripDto {
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

	@IsDateString()
	@ApiProperty({ type: Date })
	arrivalTime: Date

	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	@ApiProperty()
	totalDistance: number

	@IsInt()
	@IsPositive()
	@ApiProperty()
	totalDuration: number

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CriteriaDto)
	@ApiProperty({ type: CriteriaDto })
	criteria: JsonObject

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => Object)
	@ApiProperty({ type: [Object] })
	results: JsonArray

	@IsOptional()
	@ValidateNested()
	@Type(() => CreatePostFromTripDto)
	@ApiPropertyOptional({ type: CreatePostFromTripDto })
	post?: CreatePostFromTripDto
}
