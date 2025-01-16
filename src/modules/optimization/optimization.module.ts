import { Module } from '@nestjs/common'
import { GoogleMapsModule } from '../google-maps/google-maps.module'
import { OptimizationController } from './optimization.controller'
import { OptimizationService } from './optimization.service'

@Module({
	imports: [GoogleMapsModule],
	controllers: [OptimizationController],
	providers: [OptimizationService],
})
export class OptimizationModule {}
