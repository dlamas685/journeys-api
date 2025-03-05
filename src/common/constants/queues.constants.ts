import { Queues } from '../enums'

export const QUEUE_NAMES: Record<Queues, string> = {
	ROADMAPS: 'roadmaps',
	TRIPS: 'trips',
}

export const QUEUE_TASK_NAME: Record<
	Queues,
	{
		[key: string]: string
	}
> = {
	ROADMAPS: {
		OPTIMIZE: 'optimize',
		START: 'start',
		FINALIZE: 'finalize',
	},
	TRIPS: {
		OPTIMIZE: 'optimize',
		TO_ARCHIVE: 'to-archive',
	},
}
