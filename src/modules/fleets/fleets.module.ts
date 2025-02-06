import { Module } from '@nestjs/common'
import { VehiclesModule } from '../vehicles/vehicles.module'
import { FleetsController } from './fleets.controller'
import { FleetsService } from './fleets.service'

@Module({
	imports: [VehiclesModule],
	controllers: [FleetsController],
	exports: [FleetsService],
	providers: [FleetsService],
})
export class FleetsModule {}
