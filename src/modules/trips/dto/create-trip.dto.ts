import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { JsonValue } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'
import { CriteriaDto } from 'src/modules/optimization/routes/dto'
import { CreatePostFromTripDto } from 'src/modules/posts/dto'

export class CreateTripDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	origin: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	destination: string

	@IsDateString()
	@ApiProperty({ type: Date })
	departureTime: Date

	@IsDateString()
	@ApiProperty({ type: Date })
	arrivalTime: Date

	@IsOptional()
	@IsInt()
	@ApiPropertyOptional()
	totalDistance?: number

	@IsOptional()
	@IsInt()
	@ApiPropertyOptional()
	totalDuration?: number

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CriteriaDto)
	@ApiPropertyOptional({ type: CriteriaDto })
	criteria?: JsonValue

	@IsOptional()
	@ValidateNested()
	@Type(() => CreatePostFromTripDto)
	@ApiPropertyOptional({ type: CreatePostFromTripDto })
	post?: CreatePostFromTripDto
}
