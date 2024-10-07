import { Injectable } from '@nestjs/common'
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

	findAll() {
		return `This action returns all favoritePlaces`
	}

	findOne(id: number) {
		return `This action returns a #${id} favoritePlace`
	}

	update(id: number, updateFavoritePlaceDto: UpdateFavoritePlaceDto) {
		return `This action updates a #${id} favoritePlace`
	}

	remove(id: number) {
		return `This action removes a #${id} favoritePlace`
	}
}
