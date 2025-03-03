import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CreateRealTimeSessionDto {
	@IsUUID()
	@ApiProperty()
	tripId: string
}
