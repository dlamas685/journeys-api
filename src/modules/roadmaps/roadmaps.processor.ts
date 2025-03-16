import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Roadmap } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'
import { Job } from 'bullmq'
import { plainToInstance } from 'class-transformer'
import { FLOW_PRODUCERS_TASK_NAME, QUEUE_NAMES } from 'src/common/constants'
import { NotificationsService } from '../notifications/notifications.service'
import { RoadmapOptimizationEntity } from '../optimization/routes-optimization/entities'
import { RoadmapEntity } from './entities/roadmap.entity'
import { RoadmapsService } from './roadmaps.service'
import { JobData } from './types/job-data.type'

@Processor(QUEUE_NAMES.ROADMAPS)
export class RoadmapsConsumer extends WorkerHost {
	private logger = new Logger(RoadmapsConsumer.name)

	constructor(
		private readonly roadmap: RoadmapsService,
		private readonly notifications: NotificationsService
	) {
		super()
		this.logger.log('Roadmaps consumer started')
	}

	private readonly jobHandlers: Record<
		string,
		(data: RoadmapEntity) => Promise<void>
	> = {
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.OPTIMIZE]: this.optimize.bind(this),
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.START]: this.start.bind(this),
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.FINALIZE]: this.finalize.bind(this),
	}

	private readonly notificationHandlers: Record<
		string,
		{
			onSuccess?: (data: RoadmapEntity) => Promise<void>
			onFailure?: (data: RoadmapEntity) => Promise<void>
		}
	> = {
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.OPTIMIZE]: {
			onSuccess: this.afterOptimizationCompleted.bind(this),
			onFailure: this.afterOptimizationFailed.bind(this),
		},
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.START]: {
			onSuccess: this.afterStartedCompleted.bind(this),
			onFailure: this.afterStartedFailed.bind(this),
		},
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.FINALIZE]: {
			onSuccess: this.afterFinalizedCompleted.bind(this),
			onFailure: this.afterFinalizedFailed.bind(this),
		},
	}

	@OnWorkerEvent('completed')
	async onCompleted(job: Job<Roadmap>) {
		this.logger.log(`Job ${job.id} completed: ${job.name}`)

		const foundRoadmap = await this.roadmap.findOne(
			job.data.userId,
			job.data.id
		)

		await this.notificationHandlers[job.name]?.onSuccess?.(foundRoadmap)
	}

	@OnWorkerEvent('failed')
	async onFailed(job: Job<Roadmap>) {
		this.logger.error(`Job ${job.id} failed: ${job.name}`)

		const foundRoadmap = await this.roadmap.findOne(
			job.data.userId,
			job.data.id
		)

		await this.notificationHandlers[job.name]?.onFailure?.(foundRoadmap)
	}

	async process(job: Job<JobData>) {
		this.logger.log(`Processing job ${job.id}: ${job.name}`)

		const foundRoadmap = await this.roadmap.findOne(
			job.data.userId,
			job.data.id
		)

		await this.jobHandlers[job.name]?.(foundRoadmap)
	}

	private async optimize(data: RoadmapEntity) {
		const results = plainToInstance(RoadmapOptimizationEntity, data.results)

		await this.roadmap.setResults(
			data.userId,
			data.id,
			results as unknown as JsonObject
		)
	}

	private async start(data: RoadmapEntity) {
		await this.roadmap.changeStatus(data.userId, data.id, 'ONGOING')
	}

	private async finalize(data: RoadmapEntity) {
		await this.roadmap.changeStatus(data.userId, data.id, 'COMPLETED')
	}

	private afterOptimizationCompleted(data: RoadmapEntity) {
		this.notifications.sendOptimization(
			data.userId,
			`¡La hoja de ruta ${data.code} ha sido optimizada!`
		)
	}

	private afterStartedCompleted(data: RoadmapEntity) {
		this.notifications.sendRoadmap(
			data.userId,
			`¡La hoja de ruta ${data.code} ha iniciado!`
		)
	}

	private afterFinalizedCompleted(data: RoadmapEntity) {
		this.notifications.sendRoadmap(
			data.userId,
			`¡La hoja de ruta ${data.code} ha finalizado!`
		)
	}

	private async afterOptimizationFailed(data: RoadmapEntity) {
		this.notifications.sendOptimization(
			data.userId,
			`¡La optimización de la hoja de ruta ${data.code} ha fallado!`
		)
	}

	private async afterStartedFailed(data: RoadmapEntity) {
		this.notifications.sendRoadmap(
			data.userId,
			`¡La hoja de ruta ${data.code} ha fallado al iniciar!`
		)
	}

	private async afterFinalizedFailed(data: RoadmapEntity) {
		this.notifications.sendRoadmap(
			data.userId,
			`¡La hoja de ruta ${data.code} ha fallado al final!`
		)
	}
}
