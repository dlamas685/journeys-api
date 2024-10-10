import { Module } from '@nestjs/common'
import { FavoritePlacesController } from './favorite-places.controller'
import { FavoritePlacesService } from './favorite-places.service'

@Module({
	controllers: [FavoritePlacesController],
	providers: [FavoritePlacesService],
})
export class FavoritePlacesModule {}
