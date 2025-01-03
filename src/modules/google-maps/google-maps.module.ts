import { Module } from '@nestjs/common'
import { PlacesService } from './services/places.service'
import { RoutesService } from './services/routes.service'

@Module({
	providers: [PlacesService, RoutesService],
	exports: [PlacesService, RoutesService],
})
export class GoogleMapsModule {}
