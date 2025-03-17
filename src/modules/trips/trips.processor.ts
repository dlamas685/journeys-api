import {
	InjectQueue,
	OnWorkerEvent,
	Processor,
	WorkerHost,
} from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { JsonArray } from '@prisma/client/runtime/library'
import { Job, Queue } from 'bullmq'
import { plainToInstance } from 'class-transformer'
import { addSeconds } from 'date-fns'
import { QUEUE_NAMES, QUEUE_TASK_NAME } from 'src/common/constants'
import { NotificationsService } from '../notifications/notifications.service'
import { OptimizationService } from '../optimization/optimization.service'
import { CriteriaDto } from '../optimization/routes/dtos'
import { RouteEntity } from '../optimization/routes/entities'
import { TripEntity } from './entities/trip.entity'
import { TripsService } from './trips.service'
import { JobData } from './types/job-data.type'

@Processor('trips')
export class TripsConsumer extends WorkerHost {
	private logger: Logger = new Logger(TripsConsumer.name)

	constructor(
		private readonly trips: TripsService,
		private readonly notifications: NotificationsService,
		private readonly optimization: OptimizationService,
		@InjectQueue(QUEUE_NAMES.TRIPS) private queue: Queue
	) {
		super()

		this.logger.log('Trips consumer started')
	}

	private readonly jobHandlers: Record<
		string,
		(data: TripEntity) => Promise<void>
	> = {
		[QUEUE_TASK_NAME.TRIPS.OPTIMIZE]: this.optimize.bind(this),
		[QUEUE_TASK_NAME.TRIPS.TO_ARCHIVE]: this.toArchive.bind(this),
	}

	private readonly jobStatusHandlers: Record<
		string,
		{
			onSuccess?: (data: TripEntity) => Promise<void>
			onFailure?: (data: TripEntity) => Promise<void>
		}
	> = {
		[QUEUE_TASK_NAME.ROADMAPS.OPTIMIZE]: {
			onSuccess: this.afterOptimizationCompleted.bind(this),
			onFailure: this.afterOptimizationFailed.bind(this),
		},
		[QUEUE_TASK_NAME.ROADMAPS.TO_ARCHIVE]: {
			onSuccess: this.afterToArchiveCompleted.bind(this),
			onFailure: this.afterToArchiveFailed.bind(this),
		},
	}

	@OnWorkerEvent('completed')
	async onCompleted(job: Job<JobData>) {
		this.logger.error(`Job ${job.id} failed`)

		const foundTrip = await this.trips.findOne(job.data.userId, job.data.id)

		await this.jobStatusHandlers[job.name]?.onSuccess?.(foundTrip)
	}

	@OnWorkerEvent('failed')
	async onFailed(job: Job<JobData>) {
		this.logger.error(`Job ${job.id} failed`)

		const foundTrip = await this.trips.findOne(job.data.userId, job.data.id)

		await this.jobStatusHandlers[job.name]?.onFailure?.(foundTrip)
	}

	async process(job: Job<JobData>) {
		this.logger.log(`Processing job ${job.id}`)

		const foundTrip = await this.trips.findOne(job.data.userId, job.data.id)

		await this.jobHandlers[job.name]?.(foundTrip)
	}

	private async optimize(data: TripEntity) {
		const criteria = plainToInstance(CriteriaDto, data.criteria)

		const results = criteria.advancedCriteria
			? await this.optimization.computeAdvancedOptimization(criteria)
			: await this.optimization.computeBasicOptimization(criteria.basicCriteria)

		await this.trips.setResults(
			data.userId,
			data.id,
			results as unknown as JsonArray
		)

		this.logger.log(`Trip ${data.id} has been optimized`)
	}

	private async toArchive(data: TripEntity) {
		await this.trips.update(data.userId, data.id, {
			isArchived: true,
		})

		this.logger.log(`Trip ${data.id} has been used`)
	}

	private async afterOptimizationCompleted(data: TripEntity) {
		await this.notifications.sendOptimization(
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

	private async afterToArchiveCompleted(data: TripEntity) {
		this.notifications.sendTrip(
			data.userId,
			`¡Tu viaje ${data.code} ha sido usado!`
		)
	}

	private async afterOptimizationFailed(data: TripEntity) {
		this.notifications.sendOptimization(
			data.userId,
			`¡La optimización del viaje ${data.code} ha fallado! Por favor, intente creándolo nuevamente.`
		)
	}

	private async afterToArchiveFailed(data: TripEntity) {
		this.notifications.sendTrip(
			data.userId,
			`¡Hemos fallado al cambiar la condición del viaje ${data.code} a usado! Inténtalo de forma manual.`
		)
	}
}
