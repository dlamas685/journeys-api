import { Module } from '@nestjs/common'
import { OptimizationModule } from '../optimization/optimization.module'
import { TripsController } from './trips.controller'
import { TripsService } from './trips.service'

@Module({
	imports: [OptimizationModule],
	controllers: [TripsController],
	providers: [TripsService],
})
export class TripsModule {}
