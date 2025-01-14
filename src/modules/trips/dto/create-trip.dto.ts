import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { JsonValue } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'
import { CreateTripPresetDto } from './create-trip-preset.dto'

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
	@IsNumber()
	@ApiPropertyOptional()
	distance?: number

	@IsOptional()
	@IsInt()
	@ApiPropertyOptional()
	duration?: number

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CreateTripPresetDto)
	@ApiPropertyOptional({ type: CreateTripPresetDto })
	presets?: JsonValue
}
