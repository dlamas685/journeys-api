import { PartialType } from '@nestjs/swagger'
import { CreateActivitiesTemplateDto } from './create-activities-template.dto'

export class UpdateActivitiesTemplateDto extends PartialType(
	CreateActivitiesTemplateDto
) {}
