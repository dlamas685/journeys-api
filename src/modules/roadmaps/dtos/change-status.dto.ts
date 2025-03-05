import { RoadmapStatus } from '@prisma/client'
import { IsEnum, IsUUID } from 'class-validator'

export class ChangeStatusDto {
	@IsUUID()
	id: string

	@IsEnum(RoadmapStatus)
	status: RoadmapStatus
}
