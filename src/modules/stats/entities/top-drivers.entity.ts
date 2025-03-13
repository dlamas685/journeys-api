import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class TopDriversEntity {
	@ApiProperty()
	@Expose()
	name: string

	@ApiProperty()
	@Expose()
	countCompleted: number
}
