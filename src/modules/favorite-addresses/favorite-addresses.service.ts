import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToClass, plainToInstance } from 'class-transformer'

import {
	LocationEntity,
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { PrismaService } from '../../modules/prisma/prisma.service'
import { PlacesService } from '../google-maps/services/places.service'
import { FavoriteAddressQueryParamsDto } from './dtos'
import { CreateFavoriteAddressDto } from './dtos/create-favorite-address.dto'
import { UpdateFavoriteAddressDto } from './dtos/update-favorite-address.dto'
import { FavoriteAddressEntity } from './entities/favorite-address.entity'

@Injectable()
export class FavoriteAddressesService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly places: PlacesService
	) {}

	async create(
		userId: string,
		createFavoriteAddressDto: CreateFavoriteAddressDto
	): Promise<FavoriteAddressEntity> {
		const newFavoriteAddress = await this.prisma.favoriteAddress.create({
			data: {
				userId,
				...createFavoriteAddressDto,
			},
		})

		return new FavoriteAddressEntity(newFavoriteAddress)
	}

	async findAll(userId: string, queryParamsDto: FavoriteAddressQueryParamsDto) {
		let placeIds: string[] = []

		const addressFilter = queryParamsDto.filters?.find(
			filter => filter.field === 'address'
		)

		const newFilters =
			queryParamsDto.filters?.filter(filter => filter.field !== 'address') || []

		if (addressFilter?.value) {
			placeIds = await this.places.searchAddresses(addressFilter.value)
		}

		const parsedFilters = fromFiltersToWhere(newFilters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.FavoriteAddressFindManyArgs = {
			where: {
				userId,
				placeId: placeIds.length > 0 ? { in: placeIds } : undefined,
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
			this.prisma.favoriteAddress.findMany(query),
			this.prisma.favoriteAddress.count({ where: query.where }),
		])

		const favoriteAddresses = await Promise.all(
			records.map(async record => {
				const placeDetails = await this.places.getPlaceDetails(record.placeId)
				return new FavoriteAddressEntity({
					...record,
					address: placeDetails.formattedAddress,
					name: placeDetails.displayName.text,
					location: plainToInstance(LocationEntity, placeDetails.location),
				})
			})
		)

		const metadata = plainToClass(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return new PaginatedResponseEntity<FavoriteAddressEntity>(
			favoriteAddresses,
			metadata
		)
	}

	async findOne(userId: string, id: string) {
		const foundAddress = await this.prisma.favoriteAddress.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundAddress) {
			throw new NotFoundException('Dirección no encontrada')
		}

		const details = await this.places.getPlaceDetails(foundAddress.placeId)

		return new FavoriteAddressEntity({
			...foundAddress,
			address: details.formattedAddress,
		})
	}

	async update(
		userId: string,
		id: string,
		updateFavoriteAddressDto: UpdateFavoriteAddressDto
	): Promise<FavoriteAddressEntity> {
		const updatedFavoriteAddress = await this.prisma.favoriteAddress.update({
			where: {
				id,
				userId,
			},
			data: {
				...updateFavoriteAddressDto,
			},
		})

		return new FavoriteAddressEntity(updatedFavoriteAddress)
	}

	async remove(userId, id: string) {
		await this.prisma.favoriteAddress.delete({
			where: { id, userId },
		})

		return `Eliminación Completa!`
	}
}
