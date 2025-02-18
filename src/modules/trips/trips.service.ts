import { Injectable, NotFoundException } from '@nestjs/common'
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
import { PlacesService } from '../google-maps/services/places.service'
import { OptimizationService } from '../optimization/optimization.service'
import { CriteriaDto } from '../optimization/routes/dto'
import { PrismaService } from '../prisma/prisma.service'
import { ChangeTripStatusDto, CreateTripDto, UpdateTripDto } from './dto'
import { TripQueryParamsDto } from './dto/trip-params.dto'
import { TripEntity } from './entities/trip.entity'

@Injectable()
export class TripsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly optimization: OptimizationService,
		private readonly places: PlacesService
	) {}

	async create(
		userId: string,
		createTripDto: CreateTripDto
	): Promise<TripEntity> {
		const { post, criteria, ...data } = createTripDto

		const createdTrip = await this.prisma.trip.create({
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
