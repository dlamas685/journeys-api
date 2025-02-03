import { Module } from '@nestjs/common'
import { NexusController } from './nexus.controller'
import { NexusService } from './nexus.service'

@Module({
	controllers: [NexusController],
	providers: [NexusService],
})
export class NexusModule {}
