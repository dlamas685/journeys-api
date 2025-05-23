import { InjectFlowProducer } from '@nestjs/bullmq'
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma, RoadmapStatus } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'
import { FlowProducer } from 'bullmq'
import { plainToInstance } from 'class-transformer'
import {
	FLOW_PRODUCER_NAMES,
	FLOW_PRODUCERS_TASK_NAME,
	QUEUE_NAMES,
} from 'src/common/constants'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { AvailableRoadmapAssetQueryParamsDto } from '../nexus/dtos/available-roadmap-asset-query'
import { NexusService } from '../nexus/nexus.service'
import { PrismaService } from '../prisma/prisma.service'
import { SCHEDULED_TIME_OFFSET_MS, VALID_TRANSITIONS } from './constants'
import { CreateRoadmapDto } from './dtos/create-roadmap.dto'
import { RoadmapQueryParamsDto } from './dtos/roadmap-params.dto'
import { UpdateRoadmapDto } from './dtos/update-roadmap.dto'
import { RoadmapEntity } from './entities/roadmap.entity'
import { JobData } from './types/job-data.type'

@Injectable()
export class RoadmapsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly nexus: NexusService,
		@InjectFlowProducer(FLOW_PRODUCER_NAMES.ROADMAPS)
		private flowProducer: FlowProducer
	) {}

	async create(
		userId: string,
		createRoadmapDto: CreateRoadmapDto
	): Promise<RoadmapEntity> {
		const { startDateTime, endDateTime, fleetId, driverId, vehicleId } =
			createRoadmapDto

		const dateRange: AvailableRoadmapAssetQueryParamsDto = {
			fromDate: startDateTime,
			toDate: endDateTime,
		}

		const assignedAssets = await this.nexus.availableRoadmapAssets(
			userId,
			dateRange
		)

		const fleet = assignedAssets.find(asset => asset.id === fleetId)

		if (!fleet) {
			throw new BadRequestException('Flota no disponible')
		}

		const driver = fleet.drivers.find(driver => driver.id === driverId)

		const vehicle = fleet.vehicles.find(vehicle => vehicle.id === vehicleId)

		if (!driver || !vehicle) {
			throw new BadRequestException('Recursos no disponibles')
		}

		return this.prisma.$transaction(async prisma => {
			const createdRoadmap = await prisma.roadmap.create({
				data: {
					userId,
					...createRoadmapDto,
				},
			})

			const startDateTime = createdRoadmap.startDateTime

			const endDateTime = createdRoadmap.endDateTime

			const scheduledTime = startDateTime.getTime() - SCHEDULED_TIME_OFFSET_MS

			const timestamp = Date.now()

			const data: JobData = {
				userId,
				id: createdRoadmap.id,
			}

			await this.flowProducer.add({
				queueName: QUEUE_NAMES.ROADMAPS,
				name: FLOW_PRODUCERS_TASK_NAME.ROADMAPS.FINALIZE,
				data,
				opts: {
					jobId: createdRoadmap.id,
					delay: Math.max(0, endDateTime.getTime() - timestamp),
					attempts: 5,
					backoff: { type: 'exponential', delay: 5000 },
					removeOnFail: 5,
					removeOnComplete: 50,
				},
				children: [
					{
						queueName: QUEUE_NAMES.ROADMAPS,
						name: FLOW_PRODUCERS_TASK_NAME.ROADMAPS.START,
						data,
						opts: {
							delay: Math.max(0, startDateTime.getTime() - timestamp),
							attempts: 5,
							backoff: { type: 'exponential', delay: 5000 },
							removeOnFail: 5,
							removeOnComplete: 50,
						},
						children: [
							{
								queueName: QUEUE_NAMES.ROADMAPS,
								name: FLOW_PRODUCERS_TASK_NAME.ROADMAPS.OPTIMIZE,
								data,
								opts: {
									delay: Math.max(0, scheduledTime - timestamp),
									attempts: 5,
									backoff: { type: 'exponential', delay: 5000 },
									removeOnFail: 5,
									removeOnComplete: 50,
								},
							},
						],
					},
				],
			})

			return new RoadmapEntity({
				...createdRoadmap,
				setting: createRoadmapDto.setting as JsonObject,
				results: null,
			})
		})
	}

	async findAll(
		userId: string,
		queryParamsDto: RoadmapQueryParamsDto
	): Promise<PaginatedResponseEntity<RoadmapEntity>> {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.RoadmapFindManyArgs = {
			where: {
				userId,
				...parsedFilters,
				...parsedLogicalFilters,
			},
			orderBy: {
				...parsedSorts,
			},
			include: {
				driver: true,
				fleet: true,
				vehicle: true,
			},
			skip:
				queryParamsDto.page && queryParamsDto.limit
					? (queryParamsDto.page - 1) * queryParamsDto.limit
					: undefined,
			take: queryParamsDto.limit,
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.roadmap.findMany(query),
			this.prisma.roadmap.count({ where: query.where }),
		])

		const roadmaps = records.map(
			record =>
				new RoadmapEntity({
					...record,
					setting: record.setting as JsonObject,
					results: record.results as JsonObject,
				})
		)

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return plainToInstance(PaginatedResponseEntity, {
			data: roadmaps,
			meta: metadata,
		})
	}

	async findOne(userId: string, id: string): Promise<RoadmapEntity> {
		const foundRoadmap = await this.prisma.roadmap.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundRoadmap) {
			throw new NotFoundException('Viaje no encontrado')
		}

		return new RoadmapEntity({
			...foundRoadmap,
			setting: foundRoadmap.setting as JsonObject,
			results: foundRoadmap.results as unknown as JsonObject,
		})
	}

	async update(
		userId: string,
		id: string,
		updateRoadmapDto: UpdateRoadmapDto
	): Promise<RoadmapEntity> {
		const updatedRoadmap = await this.prisma.roadmap.update({
			where: {
				userId,
				id,
			},
			data: {
				...updateRoadmapDto,
			},
		})

		return new RoadmapEntity({
			...updatedRoadmap,
			setting: updatedRoadmap.setting as JsonObject,
			results: updatedRoadmap.results as JsonObject,
		})
	}

	async remove(userId: string, id: string): Promise<string> {
		return this.prisma.$transaction(async prisma => {
			await prisma.roadmap.delete({
				where: {
					userId,
					id,
				},
			})

			const flow = await this.flowProducer.getFlow({
				id,
				queueName: QUEUE_NAMES.ROADMAPS,
			})

			if (flow) {
				await flow.job.remove({
					removeChildren: true,
				})
			}

			return `Eliminación completa!`
		})
	}

	async changeStatus(
		userId: string,
		id: string,
		newStatus: RoadmapStatus
	): Promise<RoadmapEntity> {
		const foundRoadmap = await this.findOne(userId, id)

		if (!VALID_TRANSITIONS[foundRoadmap.status].includes(newStatus)) {
			throw new BadRequestException('Transición de estado no válida')
		}

		if (newStatus === RoadmapStatus.DISMISSED) {
			return this.prisma.$transaction(async prisma => {
				const updatedRoadmap = await prisma.roadmap.update({
					where: {
						id,
						userId,
					},
					data: {
						status: newStatus,
					},
				})

				const flow = await this.flowProducer.getFlow({
					id,
					queueName: QUEUE_NAMES.ROADMAPS,
				})

				if (flow) {
					await flow.job.remove({
						removeChildren: true,
					})
				}

				return new RoadmapEntity({
					...updatedRoadmap,
					setting: updatedRoadmap.setting as JsonObject,
					results: updatedRoadmap.results as JsonObject,
				})
			})
		}

		const updatedRoadmap = await this.prisma.roadmap.update({
			where: {
				id,
				userId,
			},
			data: {
				status: newStatus,
			},
		})

		return new RoadmapEntity({
			...updatedRoadmap,
			setting: updatedRoadmap.setting as JsonObject,
			results: updatedRoadmap.results as JsonObject,
		})
	}

	async setResults(
		userId: string,
		id: string,
		results: JsonObject
	): Promise<RoadmapEntity> {
		const updatedRoadmap = await this.prisma.roadmap.update({
			where: {
				userId,
				id,
			},
			data: {
				results,
			},
		})

		return new RoadmapEntity({
			...updatedRoadmap,
			setting: updatedRoadmap.setting as JsonObject,
			results: updatedRoadmap.results as JsonObject,
		})
	}
}
