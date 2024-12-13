import { Module } from '@nestjs/common'
import { ActivityTemplatesController } from './activity-templates.controller'
import { ActivityTemplatesService } from './activity-templates.service'

@Module({
	controllers: [ActivityTemplatesController],
	providers: [ActivityTemplatesService],
})
export class ActivityTemplatesModule {}
