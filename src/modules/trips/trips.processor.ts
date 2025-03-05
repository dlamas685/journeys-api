import {
	InjectQueue,
	OnWorkerEvent,
	Processor,
	WorkerHost,
} from '@nestjs/bullmq'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { Inject, Logger } from '@nestjs/common'
import { Trip } from '@prisma/client'
import { Job, Queue } from 'bullmq'
import { addSeconds } from 'date-fns'
import {
	QUEUE_NAMES,
	QUEUE_TASK_NAME,
	REDIS_PREFIXES,
} from 'src/common/constants'
import { NotificationsService } from '../notifications/notifications.service'
import { RouteEntity } from '../optimization/routes/entities'
import { TripsService } from './trips.service'

@Processor('trips')
export class TripsConsumer extends WorkerHost {
	private logger: Logger = new Logger(TripsConsumer.name)

	constructor(
		private readonly trips: TripsService,
		private readonly notifications: NotificationsService,
		@InjectQueue(QUEUE_NAMES.TRIPS) private queue: Queue,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
	) {
		super()
	}

	@OnWorkerEvent('completed')
	onCompleted(job: Job<Trip>) {
		this.logger.error(`Job ${job.id} failed`)

		switch (job.name) {
			case QUEUE_TASK_NAME.TRIPS.OPTIMIZE:
				this.afterOptimize(job.data)
				break

			case QUEUE_TASK_NAME.TRIPS.TO_ARCHIVE:
				this.logger.log(`Trip ${job.data.id} is archived`)
				break
			default:
				this.logger.error(`Unknown job type ${job.name}`)
		}
	}

	@OnWorkerEvent('failed')
	onFailed(job: Job<Trip>) {
		this.logger.error(`Job ${job.id} failed`)

		switch (job.name) {
			case QUEUE_TASK_NAME.TRIPS.OPTIMIZE:
				this.logger.error(`Failed to optimize trip ${job.data.id}`)

				this.notifications.sendOptimization(
					job.data.userId,
					`¡La optimización del viaje ${job.data.code} ha fallado! Por favor, intente creándolo nuevamente.`
				)

				break
			case QUEUE_TASK_NAME.TRIPS.TO_ARCHIVE:
				this.logger.error(`Failed to archive trip ${job.data.id}`)
				break
			default:
				this.logger.error(`Unknown job type ${job.name}`)
		}
	}

	async process(job: Job<Trip>) {
		this.logger.log(`Processing job ${job.id}`)

		switch (job.name) {
			case QUEUE_TASK_NAME.TRIPS.OPTIMIZE:
				await this.optimize(job.data)
				break
			case QUEUE_TASK_NAME.TRIPS.TO_ARCHIVE:
				await this.toArchive(job.data)
				break
			default:
				this.logger.error(`Unknown job type ${job.name}`)
		}
	}

	private async optimize(data: Trip) {
		const foundTrip = await this.trips.findOne(data.userId, data.id)

		const results = foundTrip.results

		let maxDuration = 0

		for (const result of results) {
			maxDuration = Math.max(maxDuration, result.duration)
		}

		const ttl = Math.max(0, maxDuration - Math.floor(Date.now() / 1000))

		if (ttl <= 0) {
			this.logger.log(`Trip ${data.id} is already expired. Skipping cache.`)
			return
		}

		await this.cacheManager.set(
			`${REDIS_PREFIXES.TRIPS_RESULTS}${data.id}`,
			results,
			ttl
		)

		this.logger.log(`Setting cache for trip ${data.id} with ttl ${ttl}`)
	}

	private async toArchive(data: Trip) {
		await this.trips.update(data.userId, data.id, {
			isArchived: true,
		})
	}

	private async afterOptimize(data: Trip) {
		this.notifications.sendOptimization(
			data.userId,
			`¡Tu viaje ${data.code} ha sido optimizado! Revisa los resultados.`
		)

		const results = await this.cacheManager.get<RouteEntity[]>(
			`${REDIS_PREFIXES.TRIPS_RESULTS}${data.id}`
		)

		let maxDuration = 0

		for (const result of results) {
			maxDuration = Math.max(maxDuration, result.duration)
		}

		const scheduleTime = addSeconds(data.departureTime, maxDuration + 1800)

		await this.queue.add(QUEUE_TASK_NAME.TRIPS.TO_ARCHIVE, data, {
			delay: Math.max(0, scheduleTime.getTime() - Date.now()),
			attempts: 5,
			backoff: {
				type: 'exponential',
				delay: 5000,
			},
		})
	}
}
