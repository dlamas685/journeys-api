import { Module } from '@nestjs/common'
import { RoadmapsController } from './roadmaps.controller'
import { RoadmapsService } from './roadmaps.service'

@Module({
	controllers: [RoadmapsController],
	providers: [RoadmapsService],
})
export class RoadmapsModule {}
