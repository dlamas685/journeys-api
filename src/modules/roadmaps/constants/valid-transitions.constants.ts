import { RoadmapStatus } from '@prisma/client'

export const VALID_TRANSITIONS: Record<RoadmapStatus, RoadmapStatus[]> = {
	UPCOMING: ['UPCOMING', 'ONGOING', 'DISMISSED'],
	ONGOING: ['ONGOING', 'COMPLETED', 'DISMISSED'],
	COMPLETED: ['COMPLETED', 'DISMISSED'],
	DISMISSED: ['DISMISSED'],
}
