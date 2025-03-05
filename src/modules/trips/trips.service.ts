import { InjectQueue } from '@nestjs/bullmq'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
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
import { CriteriaDto } from '../optimization/routes/dtos'
import { RouteEntity } from '../optimization/routes/entities'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTripDto, UpdateTripDto } from './dtos'
import { TripQueryParamsDto } from './dtos/trip-params.dto'
import { TripEntity } from './entities/trip.entity'

@Injectable()
export class TripsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly optimization: OptimizationService,
		private readonly places: PlacesService,
		@InjectQueue(QUEUE_NAMES.TRIPS) private queue: Queue,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
	) {}

	async create(
		userId: string,
		createTripDto: CreateTripDto
	): Promise<TripEntity> {
		return this.prisma.$transaction(async prisma => {
			const { criteria, ...data } = createTripDto

			const createdTrip = await prisma.trip.create({
				data: {
					userId,
					...data,
					criteria,
				},
			})

			const scheduledTime = createdTrip.departureTime.getTime() - 600000

			await this.queue.add(QUEUE_TASK_NAME.TRIPS.OPTIMIZE, createdTrip, {
				delay: Math.max(0, scheduledTime - Date.now()),
				attempts: 5,
				backoff: {
					type: 'exponential',
					delay: 5000,
				},
			})

			return new TripEntity(createdTrip)
		})
	}

	async findAll(
		userId: string,
		queryParamsDto: TripQueryParamsDto
	): Promise<PaginatedResponseEntity<TripEntity>> {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.TripFindManyArgs = {
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
			this.prisma.trip.findMany(query),
			this.prisma.trip.count({ where: query.where }),
		])

		const trips = await Promise.all(
			records.map(async record => {
				const [origin, destination] = await Promise.all([
					this.places.getPlaceDetails(record.origin),
					this.places.getPlaceDetails(record.destination),
				])

				return new TripEntity({
					...record,
					origin: origin.formattedAddress,
					destination: destination.formattedAddress,
				})
			})
		)

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return plainToInstance(PaginatedResponseEntity, {
			data: trips,
			meta: metadata,
		})
	}

	async findOne(userId: string, id: string) {
		const found = await this.prisma.trip.findFirst({
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
			const resultsCacheKey = `${REDIS_PREFIXES.TRIPS_RESULTS}${id}`

			const results =
				await this.cacheManager.get<RouteEntity[]>(resultsCacheKey)

			if (!results) {
				throw new NotFoundException('Resultados no encontrados')
			}

			return new TripEntity({
				...found,
				results,
			})
		}

		const [origin, destination] = await Promise.all([
			this.places.getPlaceDetails(found.origin),
			this.places.getPlaceDetails(found.destination),
		])

		const criteria = plainToInstance(CriteriaDto, found.criteria)

		const results = criteria.advancedCriteria
			? await this.optimization.computeAdvancedOptimization(criteria)
			: await this.optimization.computeBasicOptimization(criteria.basicCriteria)

		return new TripEntity({
			...found,
			origin: origin.formattedAddress,
			destination: destination.formattedAddress,
			results,
		})
	}

	async update(
		userId: string,
		id: string,
		updateTripDto: UpdateTripDto
	): Promise<TripEntity> {
		const updatedTrip = await this.prisma.trip.update({
			where: {
				userId,
				id,
			},
			data: {
				...updateTripDto,
			},
		})

		return new TripEntity(updatedTrip)
	}

	async remove(userId: string, id: string) {
		await this.prisma.trip.delete({
			where: {
				userId,
				id,
			},
		})

		return `Eliminación completa!`
	}
}
