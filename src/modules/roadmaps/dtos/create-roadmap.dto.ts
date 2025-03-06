import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { RoadmapStatus } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import {
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsOptional,
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

	@IsDateString()
	@ApiProperty({ type: Date })
	startDateTime: Date

	@IsDateString()
	@ApiProperty({ type: Date })
	endDateTime: Date

	@IsEnum(RoadmapStatus)
	@IsOptional()
	status?: RoadmapStatus

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => SettingDto)
	@ApiProperty({ type: SettingDto })
	setting: JsonObject
}
