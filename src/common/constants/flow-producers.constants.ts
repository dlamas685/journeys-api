import { FlowProducers } from '../enums'

export const FLOW_PRODUCER_NAMES: Record<FlowProducers, string> = {
	ROADMAPS: 'roadmaps',
	TRIPS: 'trips',
}

export const FLOW_PRODUCERS_TASK_NAME: Record<
	FlowProducers,
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
