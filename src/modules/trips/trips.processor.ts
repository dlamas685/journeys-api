import {
	InjectQueue,
	OnWorkerEvent,
	Processor,
	WorkerHost,
} from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Trip } from '@prisma/client'
import { JsonArray } from '@prisma/client/runtime/library'
import { Job, Queue } from 'bullmq'
import { plainToInstance } from 'class-transformer'
import { addSeconds } from 'date-fns'
import { QUEUE_NAMES, QUEUE_TASK_NAME } from 'src/common/constants'
import { NotificationsService } from '../notifications/notifications.service'
import { RouteEntity } from '../optimization/routes/entities'
import { TripsService } from './trips.service'

@Processor('trips')
export class TripsConsumer extends WorkerHost {
	private logger: Logger = new Logger(TripsConsumer.name)

	constructor(
		private readonly trips: TripsService,
		private readonly notifications: NotificationsService,
		@InjectQueue(QUEUE_NAMES.TRIPS) private queue: Queue
	) {
		super()

		this.logger.log('Trips consumer started')
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

		const results = plainToInstance(RouteEntity, foundTrip.results)

		this.trips.setResults(data.userId, data.id, results as unknown as JsonArray)

		this.logger.log(`Trip ${data.id} has been optimized`)
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

		const results = plainToInstance(RouteEntity, data.results as JsonArray)

		let maxDuration = 0

		for (const result of results) {
			maxDuration = Math.max(maxDuration, result.duration)
		}

		const scheduleTime = addSeconds(data.departureTime, maxDuration + 1800)

		await this.queue.add(QUEUE_TASK_NAME.TRIPS.TO_ARCHIVE, data, {
			jobId: `${QUEUE_TASK_NAME.TRIPS.TO_ARCHIVE}-${data.id}`,
			delay: Math.max(0, scheduleTime.getTime() - Date.now()),
			attempts: 5,
			backoff: {
				type: 'exponential',
				delay: 5000,
			},
			removeOnFail: 5,
			removeOnComplete: 50,
		})
	}
}
