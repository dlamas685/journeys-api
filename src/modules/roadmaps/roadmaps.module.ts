import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { FLOW_PRODUCER_NAMES } from 'src/common/constants'
import { GoogleMapsModule } from '../google-maps/google-maps.module'
import { NexusModule } from '../nexus/nexus.module'
import { NotificationsModule } from '../notifications/notifications.module'
import { OptimizationModule } from '../optimization/optimization.module'
import { RoadmapsController } from './roadmaps.controller'
import { RoadmapsConsumer } from './roadmaps.processor'
import { RoadmapsService } from './roadmaps.service'

@Module({
	imports: [
		OptimizationModule,
		GoogleMapsModule,
		NotificationsModule,
		BullModule.registerFlowProducer({
			name: FLOW_PRODUCER_NAMES.ROADMAPS,
		}),
		NexusModule,
	],
	controllers: [RoadmapsController],
	providers: [RoadmapsService, RoadmapsConsumer],
})
export class RoadmapsModule {}
