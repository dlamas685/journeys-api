import { Module } from '@nestjs/common'
import { ActivitiesTemplatesController } from './activities-templates.controller'
import { ActivitiesTemplatesService } from './activities-templates.service'

@Module({
	controllers: [ActivitiesTemplatesController],
	providers: [ActivitiesTemplatesService],
})
export class ActivitiesTemplatesModule {}
