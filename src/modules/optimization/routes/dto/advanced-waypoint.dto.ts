import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { AdvancedWaypointActivityDto } from './advanced-waypoint-activity.dto'
import { AdvancedWaypointConfigDto } from './advanced-waypoint-config.dto'
import { WaypointDto } from './waypoint.dto'

export class AdvancedWaypointDto extends WaypointDto {
	@IsArray()
	@IsOptional()
	@Type(() => AdvancedWaypointActivityDto)
	@ValidateNested({ each: true })
	@ApiPropertyOptional({ type: [AdvancedWaypointActivityDto] })
	activities?: AdvancedWaypointActivityDto[]

	@IsOptional()
	@ValidateNested()
	@Type(() => AdvancedWaypointConfigDto)
	@ApiPropertyOptional({ type: AdvancedWaypointConfigDto })
	config?: AdvancedWaypointConfigDto
}
