import { Module } from '@nestjs/common'
import { GoogleMapsModule } from '../google-maps/google-maps.module'
import { FavoritePlacesController } from './favorite-places.controller'
import { FavoritePlacesService } from './favorite-places.service'

@Module({
	controllers: [FavoritePlacesController],
	providers: [FavoritePlacesService],
	imports: [GoogleMapsModule],
})
export class FavoritePlacesModule {}
