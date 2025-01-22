import { Module } from '@nestjs/common'
import { PlacesService } from './services/places.service'
import { RouteOptimizationService } from './services/route-optimization.service'
import { RoutesService } from './services/routes.service'

@Module({
	providers: [PlacesService, RoutesService, RouteOptimizationService],
	exports: [PlacesService, RoutesService, RouteOptimizationService],
})
export class GoogleMapsModule {}
