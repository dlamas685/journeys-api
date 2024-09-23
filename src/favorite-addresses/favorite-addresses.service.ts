import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/modules/prisma/prisma.service'
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

	findAll(userId) {
		return `This action returns all favoriteAddresses`
	}

	findOne(userId: string, id: string) {
		return `This action returns a #${id} favoriteAddress`
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

	remove(userId, id: string) {
		return `This action removes a #${id} favoriteAddress`
	}
}
