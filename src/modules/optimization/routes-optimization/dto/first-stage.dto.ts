import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsDateString,
	IsNotEmpty,
	IsOptional,
	IsUUID,
	ValidateNested,
} from 'class-validator'
import { IsAfter } from 'src/common/decorators'
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
	startDateTime: string

	@IsNotEmpty()
	@IsDateString()
	@IsAfter('startDateTime', { message: 'endTime must be after startTime' })
	@ApiProperty()
	endDateTime: string

	@IsNotEmpty()
	@IsUUID()
	@ApiProperty()
	fleetId: string

	@IsNotEmpty()
	@IsUUID()
	@ApiProperty()
	driverId: string

	@IsNotEmpty()
	@IsUUID()
	@ApiProperty()
	vehicleId: string

	@IsOptional()
	@ValidateNested()
	@Type(() => ModifiersDto)
	@ApiPropertyOptional()
	modifiers?: ModifiersDto
}
