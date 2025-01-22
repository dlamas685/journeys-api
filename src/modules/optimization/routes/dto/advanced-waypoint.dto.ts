import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { CreateActivityDto } from 'src/modules/activity-templates/dto'
import { AdvancedWaypointConfigDto } from './advanced-waypoint-config.dto'
import { WaypointDto } from './waypoint.dto'

export class AdvancedWaypointDto extends WaypointDto {
	@IsArray()
	@Type(() => CreateActivityDto)
	@ValidateNested({ each: true })
	@ApiPropertyOptional({ type: [CreateActivityDto] })
	activities?: CreateActivityDto[]

	@IsOptional()
	@ValidateNested()
	@Type(() => AdvancedWaypointConfigDto)
	@ApiPropertyOptional({ type: AdvancedWaypointConfigDto })
	config?: AdvancedWaypointConfigDto
}
