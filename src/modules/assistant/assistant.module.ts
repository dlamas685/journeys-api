import { Module } from '@nestjs/common'
import { GoogleMapsModule } from '../google-maps/google-maps.module'
import { TripsModule } from '../trips/trips.module'
import { UsersModule } from '../users/users.module'
import { AssistantController } from './assistant.controller'
import { AssistantService } from './assistant.service'

@Module({
	imports: [TripsModule, UsersModule, GoogleMapsModule],
	providers: [AssistantService],
	controllers: [AssistantController],
})
export class AssistantModule {}
