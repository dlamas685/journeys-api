import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ActivityEntity {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string

	@ApiProperty()
	description: string

	@ApiPropertyOptional()
	duration: number

	constructor(partial: Partial<ActivityEntity>) {
		Object.assign(this, partial)
	}
}
