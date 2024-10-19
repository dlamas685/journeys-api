import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities/paginated-response.entity'
import {
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { fromFiltersToWhere } from '../../common/helpers/fromFiltersToWhere.helper'
import { PrismaService } from '../../modules/prisma/prisma.service'
import { FavoriteAddressesQueryParamsDto } from './dto'
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
		queryParamsDto: FavoriteAddressesQueryParamsDto
	) {
		const { filters, sorts, logicalFilters, limit, page } = queryParamsDto

		const parseFilters = fromFiltersToWhere(filters)

		const parseLogicalFilters = fromLogicalFiltersToWhere(logicalFilters)

		const parseSorts = fromSortsToOrderby(sorts)

		const query: Prisma.FavoriteAddressFindManyArgs = {
			skip: (page - 1) * limit,
			take: limit,
			where: {
				userId,
				...parseFilters,
				...parseLogicalFilters,
			},
			orderBy: {
				...parseSorts,
			},
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.favoriteAddress.findMany(query),
			this.prisma.favoriteAddress.count({ where: query.where }),
		])

		const metadata = plainToClass(PaginationMetadataEntity, {
			total: totalPages,
			page,
			lastPage: Math.ceil(totalPages / limit),
		})

		return new PaginatedResponseEntity<FavoriteAddressEntity>(records, metadata)
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
