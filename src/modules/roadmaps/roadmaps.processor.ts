import {
	InjectQueue,
	OnWorkerEvent,
	Processor,
	WorkerHost,
} from '@nestjs/bullmq'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { Inject, Logger } from '@nestjs/common'
import { Roadmap } from '@prisma/client'
import { Job, Queue } from 'bullmq'
import {
	QUEUE_NAMES,
	QUEUE_TASK_NAME,
	REDIS_PREFIXES,
} from 'src/common/constants'
import { NotificationsService } from '../notifications/notifications.service'
import { RoadmapsService } from './roadmaps.service'

@Processor(QUEUE_NAMES.ROADMAPS)
export class RoadmapsConsumer extends WorkerHost {
	private logger: Logger = new Logger(RoadmapsConsumer.name)

	constructor(
		private readonly roadmap: RoadmapsService,
		private readonly notifications: NotificationsService,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		@InjectQueue(QUEUE_NAMES.ROADMAPS) private queue: Queue
	) {
		super()
	}

	@OnWorkerEvent('completed')
	async onCompleted(job: Job<Roadmap>) {
		this.logger.log(`Job ${job.id} completed`)
		switch (job.name) {
			case QUEUE_TASK_NAME.ROADMAPS.OPTIMIZE:
				await this.afterOptimize(job.data)
				break
			case QUEUE_TASK_NAME.ROADMAPS.START:
				await this.afterStart(job.data)
				break
			case QUEUE_TASK_NAME.ROADMAPS.FINALIZE:
				await this.afterFinalize(job.data)
				break
			default:
				this.logger.error(`Unknown job type ${job.name}`)
		}
	}

	@OnWorkerEvent('failed')
	async onFailed(job: Job<Roadmap>) {
		this.logger.error(`Job ${job.id} failed`)

		switch (job.name) {
			case QUEUE_TASK_NAME.ROADMAPS.OPTIMIZE:
				this.logger.error(`Optimization job ${job.id} failed`)

				this.notifications.sendOptimization(
					job.data.userId,
					`¡La optimización de la hoja de ruta ${job.data.code} ha fallado! Por favor, intente creándola nuevamente.`
				)

				break

			case QUEUE_TASK_NAME.ROADMAPS.START:
				this.logger.error(`Start job ${job.id} failed`)
				break

			case QUEUE_TASK_NAME.ROADMAPS.FINALIZE:
				this.logger.error(`Finalize job ${job.id} failed`)
				break
			default:
				this.logger.error(`Unknown job type ${job.name}`)
		}
	}

	async process(job: Job<Roadmap>) {
		this.logger.log(`Processing job ${job.id}`)
		switch (job.name) {
			case QUEUE_TASK_NAME.ROADMAPS.OPTIMIZE:
				await this.optimize(job.data)
				break

			case QUEUE_TASK_NAME.ROADMAPS.START:
				await this.start(job.data)
				break

			case QUEUE_TASK_NAME.ROADMAPS.FINALIZE:
				await this.finalize(job.data)
				break
			default:
				this.logger.error(`Unknown job type ${job.name}`)
		}
	}

	private async optimize(data: Roadmap) {
		const foundRoadmap = await this.roadmap.findOne(data.userId, data.id)

		const results = foundRoadmap.results

		const ttl = Math.floor(
			Math.max(0, new Date(results.endDateTime).getTime() - Date.now()) / 1000
		)

		if (ttl <= 0) {
			this.logger.log(`Roadmap ${data.id} is already expired. Skipping cache.`)
			return
		}

		this.cacheManager.set(
			`${REDIS_PREFIXES.ROADMAPS_RESULTS}${data.id}`,
			results,
			ttl
		)

		this.logger.log(`Roadmap ${data.id} results cached for ${ttl}ms`)
	}

	private async start(data: Roadmap) {
		await this.roadmap.changeStatus(data.userId, data.id, 'ONGOING')
	}

	private async finalize(data: Roadmap) {
		await this.roadmap.changeStatus(data.userId, data.id, 'COMPLETED')
	}

	private async afterOptimize(data: Roadmap) {
		this.notifications.sendOptimization(
			data.userId,
			`¡La hoja de ruta ${data.code} ha sido optimizada! Revisa los resultados.`
		)

		await this.queue.add(
			QUEUE_TASK_NAME.ROADMAPS.START,
			{ roadmapId: data.id, userId: data.userId },
			{
				delay: Math.max(0, data.departureTime.getTime() - Date.now()),
				attempts: 5,
				backoff: { type: 'exponential', delay: 5000 },
			}
		)
	}

	private async afterStart(data: Roadmap) {
		this.notifications.sendRoadmap(
			data.userId,
			`¡La hoja de ruta ${data.code} ha iniciado!`
		)

		await this.queue.add(
			QUEUE_TASK_NAME.ROADMAPS.FINALIZE,
			{ roadmapId: data.id, userId: data.userId },
			{
				delay: Math.max(0, data.arrivalTime.getTime() - Date.now()),
				attempts: 5,
				backoff: { type: 'exponential', delay: 5000 },
			}
		)
	}

	private async afterFinalize(data: Roadmap) {
		this.notifications.sendRoadmap(
			data.userId,
			`¡La hoja de ruta ${data.code} ha finalizado!`
		)
	}
}
