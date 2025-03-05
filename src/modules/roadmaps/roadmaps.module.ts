import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { QUEUE_NAMES } from 'src/common/constants'
import { GoogleMapsModule } from '../google-maps/google-maps.module'
import { OptimizationModule } from '../optimization/optimization.module'
import { RoadmapsController } from './roadmaps.controller'
import { RoadmapsService } from './roadmaps.service'

@Module({
	imports: [
		OptimizationModule,
		GoogleMapsModule,
		BullModule.registerQueue({
			name: QUEUE_NAMES.ROADMAPS,
		}),
	],
	controllers: [RoadmapsController],
	providers: [RoadmapsService],
})
export class RoadmapsModule {}
