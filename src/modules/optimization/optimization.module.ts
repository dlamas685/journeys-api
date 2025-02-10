import { Module } from '@nestjs/common'
import { DriversModule } from '../drivers/drivers.module'
import { FleetsModule } from '../fleets/fleets.module'
import { GoogleMapsModule } from '../google-maps/google-maps.module'
import { VehiclesModule } from '../vehicles/vehicles.module'
import { OptimizationController } from './optimization.controller'
import { OptimizationService } from './optimization.service'

@Module({
	imports: [GoogleMapsModule, FleetsModule, DriversModule, VehiclesModule],
	controllers: [OptimizationController],
	providers: [OptimizationService],
	exports: [OptimizationService],
})
export class OptimizationModule {}
