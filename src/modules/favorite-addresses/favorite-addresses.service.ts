import { Injectable, NotFoundException } from '@nestjs/common'
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
import { PlacesService } from '../google-maps/services/places.service'
import { FavoriteAddressQueryParamsDto } from './dto'
import { CreateFavoriteAddressDto } from './dto/create-favorite-address.dto'
import { UpdateFavoriteAddressDto } from './dto/update-favorite-address.dto'
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

		const favoriteAddresses = await Promise.all(
			records.map(async record => {
				const placeDetails = await this.places.getPlaceDetails(record.placeId)
				return new FavoriteAddressEntity({
					...record,
					address: placeDetails.formatted_address,
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
			throw new NotFoundException(
				`No se encontró la dirección favorita con el id ${id}`
			)
		}

		const details = await this.places.getPlaceDetails(foundAddress.placeId)

		return new FavoriteAddressEntity({
			...foundAddress,
			address: details.formatted_address,
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
