import { Processor, WorkerHost } from '@nestjs/bullmq'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { Inject, Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { REDIS_PREFIXES } from 'src/common/constants'
import { NotificationsService } from '../notifications/notifications.service'
import { TripsService } from './trips.service'

@Processor('trips')
export class TripsConsumer extends WorkerHost {
	private logger: Logger = new Logger(TripsConsumer.name)

	constructor(
		private readonly trips: TripsService,
		private readonly notifications: NotificationsService,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
	) {
		super()
	}

	async process(job: Job<{ tripId: string; userId: string }>) {
		this.logger.log(`Processing job ${job.id}`)

		const foundTrip = await this.trips.findOne(job.data.userId, job.data.tripId)

		const results = foundTrip.results

		let maxDuration = 0

		for (const result of results) {
			maxDuration = Math.max(maxDuration, result.duration)
		}

		const ttl = Math.max(0, maxDuration - Date.now())

		await this.cacheManager.set(
			`${REDIS_PREFIXES.TRIPS_RESULTS}${job.data.tripId}`,
			results,
			ttl
		)

		this.logger.log(`Setting cache for trip ${job.data.tripId} with ttl ${ttl}`)

		await this.notifications.sendTripNextStart(job.data.userId)
	}
}
