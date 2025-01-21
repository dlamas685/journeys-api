import { ApiProperty } from '@nestjs/swagger'

export class LocalizedValuesEntity {
	@ApiProperty()
	distance: string

	@ApiProperty()
	duration: string

	@ApiProperty()
	staticDuration: string
}
