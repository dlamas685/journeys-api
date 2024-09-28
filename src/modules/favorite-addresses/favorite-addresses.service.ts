import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { Filtering } from 'src/common/decorators/filtering-params.decorator'
import { Pagination } from 'src/common/decorators/pagination-params.decorator'
import {
	getOrder,
	getWhere,
} from 'src/common/decorators/prisma-pagination-helper'
import { Sorting } from 'src/common/decorators/sorting-params.decorator'
import { PrismaService } from '../../modules/prisma/prisma.service'
import { CreateFavoriteAddressDto } from './dto/create-favorite-address.dto'
import { UpdateFavoriteAddressDto } from './dto/update-favorite-address.dto'
import { FavoriteAddressEntity } from './entities/favorite-address.entity'

@Injectable()
export class FavoriteAddressesService {
	constructor(private readonly prisma: PrismaService) {}

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

	async findAll(
		userId: string,
		paginationParams: Pagination,
		sort: Sorting[],
		filter: Filtering[]
	) {
		const whereFilters = getWhere(filter)
		const order = getOrder(sort)

		const query: Prisma.FavoriteAddressFindManyArgs = {
			skip: (paginationParams.page - 1) * paginationParams.limit,
			take: paginationParams.limit,
			where: {
				userId: userId,
				...whereFilters,
			},
			orderBy: order,
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.favoriteAddress.findMany(query),
			this.prisma.favoriteAddress.count({ where: query.where }),
		])

		return {
			data: plainToInstance(FavoriteAddressEntity, records),
			meta: {
				total: totalPages,
				page: paginationParams.page,
			},
		}
	}

	async findOne(userId: string, id: string) {
		const foundAddress = await this.prisma.favoriteAddress.findFirst({
			where: {
				id,
				userId,
			},
		})

		return new FavoriteAddressEntity(foundAddress)
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

		return `Eliminacion Completa!`
	}
}
