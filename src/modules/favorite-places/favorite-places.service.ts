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
import { PrismaService } from '../prisma/prisma.service'
import { CreateFavoritePlaceDto } from './dto/create-favorite-place.dto'
import { UpdateFavoritePlaceDto } from './dto/update-favorite-place.dto'
import { FavoritePlaceEntity } from './entities/favorite-place.entity'

@Injectable()
export class FavoritePlacesService {
	constructor(private readonly prisma: PrismaService) {}

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
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)
		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)
		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.FavoritePlaceFindManyArgs = {
			where: {
				userId,
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

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return new PaginatedResponseEntity<FavoritePlaceEntity>(
			plainToInstance(FavoritePlaceEntity, records),
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

		return new FavoritePlaceEntity(foundPlace)
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
