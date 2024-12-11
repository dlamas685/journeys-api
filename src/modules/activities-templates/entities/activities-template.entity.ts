import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ActivitiesTemplate, Prisma } from '@prisma/client'

export class ActivitiesTemplateEntity implements ActivitiesTemplate {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	name: string

	@ApiProperty()
	description: string

	@ApiProperty()
	activities: Prisma.JsonValue | null

	@ApiProperty()
	createdAt: Date

	@ApiPropertyOptional()
	updatedAt: Date | null

	constructor(partial: Partial<ActivitiesTemplateEntity>) {
		Object.assign(this, partial)
	}
}
