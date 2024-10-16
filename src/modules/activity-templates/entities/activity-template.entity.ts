import { ApiProperty } from '@nestjs/swagger'
import { ActivityTemplate, Prisma } from '@prisma/client'

export class ActivityTemplateEntity implements ActivityTemplate {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	name: string

	@ApiProperty()
	description: string | null

	@ApiProperty()
	activities: Prisma.JsonValue | null

	createdAt: Date
	updatedAt: Date | null

	constructor(partial: Partial<ActivityTemplateEntity>) {
		Object.assign(this, partial)
	}
}
