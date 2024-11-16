import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'

import { Decimal } from '@prisma/client/runtime/library'
import { QueryParamsDto } from 'src/common/dto'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities/paginated-response.entity'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { translatePlaceTypes } from '../google-maps/helpers/place-translations.helper'
import { PlacesService } from '../google-maps/services/places.service'
import { PrismaService } from '../prisma/prisma.service'
import { CreateFavoritePlaceDto } from './dto/create-favorite-place.dto'
import { UpdateFavoritePlaceDto } from './dto/update-favorite-place.dto'
import { FavoritePlaceEntity } from './entities/favorite-place.entity'

@Injectable()
export class FavoritePlacesService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly places: PlacesService
	) {}

	async create(
		userId: string,
		createFavoritePlaceDto: CreateFavoritePlaceDto
	): Promise<FavoritePlaceEntity> {
		const newFavoritePlace = await this.prisma.favoritePlace.create({
			data: {
				userId,
				...createFavoritePlaceDto,
				latitude: new Decimal(createFavoritePlaceDto.latitude),
				longitude: new Decimal(createFavoritePlaceDto.longitude),
			},
		})

		return new FavoritePlaceEntity(newFavoritePlace)
	}

	async findAll(userId: string, queryParamsDto: QueryParamsDto) {
		let placeIds: string[] = []

		const addressFilter = queryParamsDto.filters?.find(
			filter => filter.field === 'name'
		)

		const newFilters =
			queryParamsDto.filters?.filter(filter => filter.field !== 'address') || []

		if (addressFilter?.value) {
			placeIds = await this.places.searchPlaces(addressFilter.value)
		}

		const parsedFilters = fromFiltersToWhere(newFilters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.FavoritePlaceFindManyArgs = {
			where: {
				userId,
				placeId: placeIds.length > 0 ? { in: placeIds } : undefined,
				...parsedFilters,
				...parsedLogicalFilters,
			},
			orderBy: {
				...parsedSorts,
			},
			skip: (queryParamsDto.page - 1) * queryParamsDto.limit,
			take: queryParamsDto.limit,
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.favoritePlace.findMany(query),
			this.prisma.favoritePlace.count({ where: query.where }),
		])

		const favoritePlaces = await Promise.all(
			records.map(async record => {
				const placeDetails = await this.places.getPlaceDetails(record.placeId, [
					'icon',
					'icon_background_color',
					'types',
				])

				return new FavoritePlaceEntity({
					...record,
					name: placeDetails.name,
					types: translatePlaceTypes(placeDetails.types),
					address: placeDetails.formatted_address,
					iconUrl: placeDetails.icon,
					iconBackgroundColor: placeDetails.icon_background_color,
				})
			})
		)

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return new PaginatedResponseEntity<FavoritePlaceEntity>(
			favoritePlaces,
			metadata
		)
	}

	async findOne(userId: string, id: string): Promise<FavoritePlaceEntity> {
		const foundPlace = await this.prisma.favoritePlace.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundPlace) {
			throw new Error('Place not found')
		}

		const details = await this.places.getPlaceDetails(foundPlace.placeId, [
			'icon',
			'icon_background_color',
			'types',
		])

		return new FavoritePlaceEntity({
			...foundPlace,
			types: translatePlaceTypes(details.types),
			address: details.formatted_address,
			iconUrl: details.icon,
			iconBackgroundColor: details.icon_background_color,
		})
	}

	async update(
		userId: string,
		id: string,
		updateFavoritePlaceDto: UpdateFavoritePlaceDto
	): Promise<FavoritePlaceEntity> {
		const updatedFavoritePlace = await this.prisma.favoritePlace.update({
			where: {
				id,
				userId,
			},
			data: {
				...updateFavoritePlaceDto,
				latitude: updateFavoritePlaceDto.latitude
					? new Decimal(updateFavoritePlaceDto.latitude)
					: undefined,
				longitude: updateFavoritePlaceDto.longitude
					? new Decimal(updateFavoritePlaceDto.longitude)
					: undefined,
			},
		})

		return new FavoritePlaceEntity(updatedFavoritePlace)
	}

	async remove(userId: string, id: string) {
		await this.prisma.favoritePlace.delete({
			where: { id, userId },
		})

		return `Eliminación completa!`
	}
}
