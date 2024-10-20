import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
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
import { FavoriteAddressQueryParamsDto } from './dto'
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
				latitude: new Decimal(createFavoriteAddressDto.latitude),
				longitude: new Decimal(createFavoriteAddressDto.longitude),
			},
		})

		return new FavoriteAddressEntity(newFavoriteAddress)
	}

	async findAll(userId: string, queryParamsDto: FavoriteAddressQueryParamsDto) {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.FavoriteAddressFindManyArgs = {
			skip: (queryParamsDto.page - 1) * queryParamsDto.limit,
			take: queryParamsDto.limit,
			where: {
				userId,
				...parsedFilters,
				...parsedLogicalFilters,
			},
			orderBy: {
				...parsedSorts,
			},
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.favoriteAddress.findMany(query),
			this.prisma.favoriteAddress.count({ where: query.where }),
		])

		const favoriteAddresses = records.map(
			record => new FavoriteAddressEntity(record)
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
				latitude: updateFavoriteAddressDto.latitude
					? new Decimal(updateFavoriteAddressDto.latitude)
					: undefined,
				longitude: updateFavoriteAddressDto.longitude
					? new Decimal(updateFavoriteAddressDto.longitude)
					: undefined,
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
