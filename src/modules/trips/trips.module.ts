import { Module } from '@nestjs/common'
import { GoogleMapsModule } from '../google-maps/google-maps.module'
import { OptimizationModule } from '../optimization/optimization.module'
import { TripsController } from './trips.controller'
import { TripsService } from './trips.service'

@Module({
	imports: [OptimizationModule, GoogleMapsModule],
	controllers: [TripsController],
	providers: [TripsService],
})
export class TripsModule {}
