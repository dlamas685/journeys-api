import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { JsonValue } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator'
import { PresetsDto } from 'src/modules/optimization/routes-optimization/dto'

export class CreateRoadmapDto {
	@IsUUID()
	@IsNotEmpty()
	fleetId: string

	@IsUUID()
	@IsNotEmpty()
	driverId: string

	@IsUUID()
	@IsNotEmpty()
	vehicleId: string

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
	@Type(() => PresetsDto)
	@ApiPropertyOptional({ type: PresetsDto })
	presets?: JsonValue
}
