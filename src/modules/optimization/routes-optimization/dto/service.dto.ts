import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsPositive, IsUUID, ValidateNested } from 'class-validator'
import { CreateActivityDto } from 'src/modules/activity-templates/dto'
import { WaypointDto } from './waypoint.dto'

export class ServiceDto extends CreateActivityDto {
	@IsUUID()
	@ApiProperty()
	id: string

	@IsNumber()
	@IsPositive()
	@ApiProperty()
	duration: number

	@Type(() => WaypointDto)
	@ValidateNested()
	@ApiProperty({ type: WaypointDto })
	waypoint: WaypointDto
}
