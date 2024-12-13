import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ActivityTemplate } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export class ActivityTemplateEntity implements ActivityTemplate {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	name: string

	@ApiProperty()
	description: string

	@ApiProperty()
	activities: JsonValue | null

	@ApiProperty()
	createdAt: Date

	@ApiPropertyOptional()
	updatedAt: Date | null

	constructor(partial: Partial<ActivityTemplateEntity>) {
		Object.assign(this, partial)
	}
}
