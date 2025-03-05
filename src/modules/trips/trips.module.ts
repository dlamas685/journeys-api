import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { QUEUE_NAMES } from 'src/common/constants'
import { GoogleMapsModule } from '../google-maps/google-maps.module'
import { NotificationsModule } from '../notifications/notifications.module'
import { OptimizationModule } from '../optimization/optimization.module'
import { TripsController } from './trips.controller'
import { TripsConsumer } from './trips.processor'
import { TripsService } from './trips.service'

@Module({
	imports: [
		OptimizationModule,
		GoogleMapsModule,
		BullModule.registerQueue({
			name: QUEUE_NAMES.TRIPS,
		}),
		NotificationsModule,
	],
	controllers: [TripsController],
	providers: [TripsService, TripsConsumer],
	exports: [TripsService],
})
export class TripsModule {}
