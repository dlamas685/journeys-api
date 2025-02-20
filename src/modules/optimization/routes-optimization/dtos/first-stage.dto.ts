import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsDateString,
	IsOptional,
	IsUUID,
	ValidateNested,
} from 'class-validator'
import { IsAfter } from 'src/common/decorators'
import { ModifiersDto } from './modifiers.dto'
import { WaypointDto } from './waypoint.dto'

export class FirstStageDto {
	@ValidateNested()
	@Type(() => WaypointDto)
	@ApiProperty()
	startWaypoint: WaypointDto

	@ValidateNested()
	@Type(() => WaypointDto)
	@ApiProperty()
	endWaypoint: WaypointDto

	@IsDateString()
	@ApiProperty()
	startDateTime: string

	@IsDateString()
	@IsAfter('startDateTime', { message: 'endTime must be after startTime' })
	@ApiProperty()
	endDateTime: string

	@IsUUID()
	@ApiProperty()
	fleetId: string

	@IsUUID()
	@ApiProperty()
	driverId: string

	@IsUUID()
	@ApiProperty()
	vehicleId: string

	@IsOptional()
	@ValidateNested()
	@Type(() => ModifiersDto)
	@ApiPropertyOptional()
	modifiers?: ModifiersDto
}
