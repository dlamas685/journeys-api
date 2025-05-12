import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { JsonArray, JsonObject } from '@prisma/client/runtime/library'
import { Queue } from 'bullmq'
import { plainToInstance } from 'class-transformer'
import { QUEUE_NAMES, QUEUE_TASK_NAME } from 'src/common/constants'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { OptimizationService } from '../optimization/optimization.service'
import { CriteriaDto } from '../optimization/routes/dtos'
import { PrismaService } from '../prisma/prisma.service'
import { SCHEDULED_TIME_OFFSET_MS } from './constants/scheduled_time_offset_ms.constant'
import { CreateTripDto, ReplicateTripDto, UpdateTripDto } from './dtos'
import { TripQueryParamsDto } from './dtos/trip-params.dto'
import { TripEntity } from './entities/trip.entity'

@Injectable()
export class TripsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly optimization: OptimizationService,
		@InjectQueue(QUEUE_NAMES.TRIPS) private queue: Queue
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

			const departureTime = createdTrip.departureTime

			const scheduledTime = departureTime.getTime() - SCHEDULED_TIME_OFFSET_MS

			await this.queue.add(
				QUEUE_TASK_NAME.TRIPS.OPTIMIZE,
				{ userId, id: createdTrip.id },
				{
					jobId: `${QUEUE_TASK_NAME.TRIPS.OPTIMIZE}-${createdTrip.id}`,
					delay: Math.max(0, scheduledTime - Date.now()),
					attempts: 5,
					backoff: {
						type: 'exponential',
						delay: 5000,
					},
					removeOnFail: 5,
					removeOnComplete: 50,
				}
			)

			return new TripEntity({
				...createdTrip,
				criteria: createTripDto.criteria as JsonObject,
				results: null,
			})
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

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return plainToInstance(PaginatedResponseEntity, {
			data: records,
			meta: metadata,
		})
	}

	async findOne(userId: string, id: string) {
		const foundTrip = await this.prisma.trip.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundTrip) {
			throw new NotFoundException('Viaje no encontrado')
		}

		return new TripEntity({
			...foundTrip,
			results: foundTrip.results as JsonArray,
			criteria: foundTrip.criteria as JsonObject,
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

		return new TripEntity({
			...updatedTrip,
			criteria: updatedTrip.criteria as JsonObject,
			results: updatedTrip.results as JsonArray,
		})
	}

	async remove(userId: string, id: string) {
		return this.prisma.$transaction(async prisma => {
			await prisma.trip.delete({
				where: {
					userId,
					id,
				},
			})

			const jobIds = [
				`${QUEUE_TASK_NAME.TRIPS.OPTIMIZE}-${id}`,
				`${QUEUE_TASK_NAME.TRIPS.TO_ARCHIVE}-${id}`,
			]

			const jobs = (
				await Promise.all(jobIds.map(jobId => this.queue.getJob(jobId)))
			).filter(Boolean)

			await Promise.all(jobs.map(job => job.remove()))

			return `Eliminación completa!`
		})
	}

	async setResults(userId: string, id: string, results: JsonArray) {
		const updatedTrip = await this.prisma.trip.update({
			where: {
				userId,
				id,
			},
			data: {
				results,
			},
		})

		return new TripEntity({
			...updatedTrip,
			criteria: updatedTrip.criteria as JsonObject,
			results: updatedTrip.results as JsonArray,
		})
	}

	async replicate(userId: string, replicateTripDto: ReplicateTripDto) {
		const trip = await this.prisma.trip.findFirst({
			where: {
				id: replicateTripDto.id,
				userId,
			},
		})

		if (!trip) {
			throw new NotFoundException('Viaje no encontrado')
		}

		const criteria = trip.criteria

		let parsedCriteria = plainToInstance(CriteriaDto, criteria)

		if (replicateTripDto.departureTime) {
			parsedCriteria = {
				...parsedCriteria,
				basicCriteria: {
					...parsedCriteria.basicCriteria,
					departureTime: replicateTripDto.departureTime,
				},
			}

			const createTripDto: CreateTripDto = {
				code: replicateTripDto.code,
				departureTime: new Date(replicateTripDto.departureTime),
				criteria: parsedCriteria as unknown as JsonObject,
			}

			return await this.create(userId, createTripDto)
		}

		const departureTime = new Date()

		departureTime.setMinutes(departureTime.getMinutes() + 30)

		parsedCriteria = {
			...parsedCriteria,
			basicCriteria: {
				...parsedCriteria.basicCriteria,
				departureTime: departureTime.toISOString(),
			},
		}

		const createTripDto: CreateTripDto = {
			code: replicateTripDto.code,
			departureTime,
			criteria: parsedCriteria as unknown as JsonObject,
		}

		return await this.create(userId, createTripDto)
	}
}
