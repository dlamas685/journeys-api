import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class VisitEntity {
	@ApiProperty()
	visitId: string

	@ApiProperty()
	visitName: string

	@ApiPropertyOptional()
	visitDescription?: string

	@ApiProperty()
	visitDuration: number

	@ApiProperty()
	startDateTime: string

	@ApiProperty()
	detour: number
}
