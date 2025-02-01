import { ApiProperty } from '@nestjs/swagger'
import { RoadmapStatus } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class ChangeRoadmapStatusDto {
	@IsString()
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ example: '9d8f5715-2e7c-4e64-8e34-35f510c12e66' })
	id: string

	@IsEnum(RoadmapStatus)
	@ApiProperty({
		enum: RoadmapStatus,
		example: Object.keys(RoadmapStatus).join(' | '),
	})
	status: RoadmapStatus
}
