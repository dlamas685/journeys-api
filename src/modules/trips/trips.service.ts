import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities/paginated-response.entity'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { RouteEntity } from '../optimization/routes/entities'
import { PrismaService } from '../prisma/prisma.service'
import { ChangeTripStatusDto, CreateTripDto, UpdateTripDto } from './dto'
import { TripQueryParamsDto } from './dto/trip-params.dto'
import { TripEntity } from './entities/trip.entity'

@Injectable()
export class TripsService {
	constructor(
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		private readonly prisma: PrismaService
	) {}

	async create(
		userId: string,
		createTripDto: CreateTripDto
	): Promise<TripEntity> {
		const { post, results, criteria, ...data } = createTripDto

		const createdTrip = await this.prisma.$transaction(async prisma => {
			const createdTrip = await prisma.trip.create({
				data: {
					userId,
					...data,
					criteria,
					post: post && {
						create: {
							userId,
							...post,
						},
					},
				},
			})

			const tripResultsKey = `trip-results-${createdTrip.id}`

			await this.cacheManager.set(
				tripResultsKey,
				plainToInstance(RouteEntity, results)
			)

			return createdTrip
		})

		return new TripEntity(createdTrip)
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

		const trips = records.map(record => new TripEntity(record))

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
		const foundTrip = await this.prisma.trip.findFirst({
			where: {
				id,
				userId,
			},
		})

		const results = await this.cacheManager.get<RouteEntity>(
			`trip-results-${id}`
		)

		if (!foundTrip) {
			throw new NotFoundException('Viaje no encontrado')
		}

		return new TripEntity({ ...foundTrip, results })
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

	async changeStatus(
		userId: string,
		changeTripStatusDto: ChangeTripStatusDto
	): Promise<TripEntity> {
		const changedTripStatus = await this.prisma.trip.update({
			where: {
				userId,
				id: changeTripStatusDto.id,
			},
			data: {
				tripStatus: changeTripStatusDto.tripStatus,
			},
		})

		return new TripEntity(changedTripStatus)
	}
}
