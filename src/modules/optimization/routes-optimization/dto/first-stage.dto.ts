import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsDateString,
	IsNotEmpty,
	IsOptional,
	ValidateNested,
} from 'class-validator'
import { ModifiersDto } from './modifiers.dto'
import { WaypointDto } from './waypoint.dto'

export class FirstStageDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => WaypointDto)
	@ApiProperty()
	startWaypoint: WaypointDto

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => WaypointDto)
	@ApiProperty()
	endWaypoint: WaypointDto

	@IsNotEmpty()
	@IsDateString()
	@ApiProperty()
	endTime: string

	@IsNotEmpty()
	@IsDateString()
	@ApiProperty()
	startTime: string

	@IsOptional()
	@ValidateNested()
	@Type(() => ModifiersDto)
	@ApiPropertyOptional()
	modifiers?: ModifiersDto
}
