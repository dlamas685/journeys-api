import { PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { CreateActivityDto } from './create-activity.dto'

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
	@IsString()
	@IsUUID()
	@IsNotEmpty()
	id: string
}
