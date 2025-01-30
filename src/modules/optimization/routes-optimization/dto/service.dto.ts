import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsNotEmpty,
	IsNumber,
	IsPositive,
	IsUUID,
	ValidateNested,
} from 'class-validator'
import { CreateActivityDto } from 'src/modules/activity-templates/dto'
import { WaypointDto } from './waypoint.dto'

export class ServiceDto extends CreateActivityDto {
	@IsNotEmpty()
	@IsUUID()
	@ApiProperty()
	id: string

	@IsNumber()
	@IsPositive()
	@IsNotEmpty()
	@ApiProperty()
	duration: number

	@IsNotEmpty()
	@Type(() => WaypointDto)
	@ValidateNested()
	@ApiProperty({ type: WaypointDto })
	waypoint: WaypointDto
}
