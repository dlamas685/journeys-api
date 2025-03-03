import { Module } from '@nestjs/common'
import { TripsModule } from '../trips/trips.module'
import { UsersModule } from '../users/users.module'
import { AssistantController } from './assistant.controller'
import { AssistantService } from './assistant.service'

@Module({
	imports: [TripsModule, UsersModule],
	providers: [AssistantService],
	controllers: [AssistantController],
})
export class AssistantModule {}
