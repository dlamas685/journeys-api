import { OmitType, PartialType } from '@nestjs/swagger'
import { CreateRoadmapDto } from './create-roadmap.dto'

export class UpdateRoadmapDto extends PartialType(
	OmitType(CreateRoadmapDto, ['setting', 'arrivalTime', 'departureTime'])
) {}
