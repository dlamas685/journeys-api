import { InjectQueue } from '@nestjs/bullmq'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma, RoadmapStatus } from '@prisma/client'
import { Queue } from 'bullmq'
import { plainToInstance } from 'class-transformer'
import {
	QUEUE_NAMES,
	QUEUE_TASK_NAME,
	REDIS_PREFIXES,
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
import { PlacesService } from '../google-maps/services/places.service'
import { OptimizationService } from '../optimization/optimization.service'
import { SettingDto } from '../optimization/routes-optimization/dtos'
import { RoadmapOptimizationEntity } from '../optimization/routes-optimization/entities'
import { PrismaService } from '../prisma/prisma.service'
import { VALID_TRANSITIONS } from './constants/valid-transitions.constants'
import { CreateRoadmapDto } from './dtos/create-roadmap.dto'
import { RoadmapQueryParamsDto } from './dtos/roadmap-params.dto'
import { UpdateRoadmapDto } from './dtos/update-roadmap.dto'
import { RoadmapEntity } from './entities/roadmap.entity'

@Injectable()
export class RoadmapsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly optimization: OptimizationService,
		private readonly places: PlacesService,
		@InjectQueue(QUEUE_NAMES.ROADMAPS) private queue: Queue,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
	) {}

	async create(
		userId: string,
		createRoadmapDto: CreateRoadmapDto
	): Promise<RoadmapEntity> {
		return this.prisma.$transaction(async prisma => {
			const createdRoadmap = await prisma.roadmap.create({
				data: {
					userId,
					...createRoadmapDto,
				},
			})

			const scheduledTime = createdRoadmap.departureTime.getTime() - 600000

			await this.queue.add(QUEUE_TASK_NAME.ROADMAPS.OPTIMIZE, createdRoadmap, {
				delay: Math.max(0, scheduledTime - Date.now()),
				attempts: 5,
				backoff: { type: 'exponential', delay: 5000 },
			})

			return new RoadmapEntity(createdRoadmap)
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

		const roadmaps = records.map(record => new RoadmapEntity(record))

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
		const found = await this.prisma.roadmap.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!found) {
			throw new NotFoundException('Viaje no encontrado')
		}

		const currentDate = new Date()

		if (currentDate > found.departureTime) {
			const resultsCacheKey = `${REDIS_PREFIXES.ROADMAPS_RESULTS}${id}`

			const results =
				await this.cacheManager.get<RoadmapOptimizationEntity>(resultsCacheKey)

			if (!results) {
				throw new NotFoundException('Resultados no encontrados')
			}

			return new RoadmapEntity({
				...found,
				results,
			})
		}

		const [origin, destination] = await Promise.all([
			this.places.getPlaceDetails(found.origin),
			this.places.getPlaceDetails(found.destination),
		])

		const setting = plainToInstance(SettingDto, found.setting)

		const results = await this.optimization.optimizeTours(userId, setting)

		return new RoadmapEntity({
			...found,
			origin: origin.formattedAddress,
			destination: destination.formattedAddress,
			results,
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

		return new RoadmapEntity(updatedRoadmap)
	}

	async remove(userId: string, id: string): Promise<string> {
		await this.prisma.roadmap.delete({
			where: {
				userId,
				id,
			},
		})

		return `Eliminación completa!`
	}

	async changeStatus(
		userId: string,
		id: string,
		newStatus: RoadmapStatus
	): Promise<RoadmapEntity> {
		const found = await this.prisma.roadmap.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!found) {
			throw new NotFoundException('Viaje no encontrado')
		}

		if (!VALID_TRANSITIONS[found.status].includes(newStatus)) {
			throw new BadRequestException('Transición de estado no válida')
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

		return new RoadmapEntity(updatedRoadmap)
	}
}
