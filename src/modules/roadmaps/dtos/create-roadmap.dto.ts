import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { RoadmapStatus } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsUUID,
	ValidateNested,
} from 'class-validator'
import { SettingDto } from 'src/modules/optimization/routes-optimization/dtos'

export class CreateRoadmapDto {
	@IsOptional()
	@ApiPropertyOptional()
	code?: string

	@IsUUID()
	@ApiProperty()
	fleetId: string

	@IsUUID()
	@ApiProperty()
	driverId: string

	@IsUUID()
	@ApiProperty()
	vehicleId: string

	@IsEnum(RoadmapStatus)
	@IsOptional()
	status?: RoadmapStatus

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
	@Type(() => SettingDto)
	@ApiProperty({ type: SettingDto })
	setting: JsonValue
}
