import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Roadmap } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'
import { Job } from 'bullmq'
import { plainToInstance } from 'class-transformer'
import { FLOW_PRODUCERS_TASK_NAME, QUEUE_NAMES } from 'src/common/constants'
import { NotificationsService } from '../notifications/notifications.service'
import { RoadmapOptimizationEntity } from '../optimization/routes-optimization/entities'
import { RoadmapsService } from './roadmaps.service'

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

	/** Mapeo de tareas y métodos */
	private readonly jobHandlers: Record<
		string,
		(data: Roadmap) => Promise<void>
	> = {
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.OPTIMIZE]: this.optimize.bind(this),
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.START]: this.start.bind(this),
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.FINALIZE]: this.finalize.bind(this),
	}

	private readonly notificationHandlers: Record<
		string,
		(data: Roadmap) => void
	> = {
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.OPTIMIZE]: this.afterOptimize.bind(this),
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.START]: this.afterStart.bind(this),
		[FLOW_PRODUCERS_TASK_NAME.ROADMAPS.FINALIZE]: this.afterFinalize.bind(this),
	}

	/**  Evento cuando un trabajo finaliza */
	@OnWorkerEvent('completed')
	async onCompleted(job: Job<Roadmap>) {
		this.logger.log(`Job ${job.id} completed: ${job.name}`)

		this.notificationHandlers[job.name]?.(job.data)
	}

	/**  Evento cuando un trabajo falla */
	@OnWorkerEvent('failed')
	async onFailed(job: Job<Roadmap>) {
		this.logger.error(`Job ${job.id} failed: ${job.name}`)

		if (job.name === FLOW_PRODUCERS_TASK_NAME.ROADMAPS.OPTIMIZE) {
			this.notifications.sendOptimization(
				job.data.userId,
				`¡La optimización de la hoja de ruta ${job.data.code} ha fallado!`
			)
		}
	}

	async process(job: Job<Roadmap>) {
		this.logger.log(`Processing job ${job.id}: ${job.name}`)

		await this.jobHandlers[job.name]?.(job.data)
	}

	/** Métodos de ejecución de trabajos */
	private async optimize(data: Roadmap) {
		const foundRoadmap = await this.roadmap.findOne(data.userId, data.id)

		const results = plainToInstance(
			RoadmapOptimizationEntity,
			foundRoadmap.results
		)

		await this.roadmap.setResults(
			data.userId,
			data.id,
			results as unknown as JsonObject
		)

		this.logger.log(`Optimization for roadmap ${data.id} completed`)
	}

	private async start(data: Roadmap) {
		await this.roadmap.changeStatus(data.userId, data.id, 'ONGOING')
	}

	private async finalize(data: Roadmap) {
		await this.roadmap.changeStatus(data.userId, data.id, 'COMPLETED')
	}

	/** Métodos de notificación */
	private afterOptimize(data: Roadmap) {
		this.notifications.sendOptimization(
			data.userId,
			`¡La hoja de ruta ${data.code} ha sido optimizada!`
		)
	}

	private afterStart(data: Roadmap) {
		this.notifications.sendRoadmap(
			data.userId,
			`¡La hoja de ruta ${data.code} ha iniciado!`
		)
	}

	private afterFinalize(data: Roadmap) {
		this.notifications.sendRoadmap(
			data.userId,
			`¡La hoja de ruta ${data.code} ha finalizado!`
		)
	}
}
