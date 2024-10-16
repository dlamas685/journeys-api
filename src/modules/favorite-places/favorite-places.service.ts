import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { Sorting } from 'src/common/decorators/sorting-params.decorator'
import { Filtering } from '../../common/decorators/filtering-params.decorator'
import { Pagination } from '../../common/decorators/pagination-params.decorator'
import {
	getOrder,
	getWhere,
} from '../../common/helpers/prisma-pagination-helper'
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
			},
		})

		return new FavoritePlaceEntity(newFavoritePlace)
	}

	async findAll(
		userId: string,
		paginationParams: Pagination,
		sort: Sorting[],
		filter: Filtering[]
	) {
		const whereFilters = getWhere(filter)
		const order = getOrder(sort)

		const query: Prisma.FavoritePlaceFindManyArgs = {
			skip: (paginationParams.page - 1) * paginationParams.limit,
			take: paginationParams.limit,
			where: {
				userId: userId,
				...whereFilters,
			},
			orderBy: order,
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.favoritePlace.findMany(query),
			this.prisma.favoritePlace.count({ where: query.where }),
		])

		return {
			data: plainToInstance(FavoritePlaceEntity, records),
			meta: {
				total: totalPages,
				page: paginationParams.page,
			},
		}
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
