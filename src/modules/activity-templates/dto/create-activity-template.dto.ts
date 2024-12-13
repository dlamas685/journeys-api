import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { JsonValue } from '@prisma/client/runtime/library'
import { Type } from 'class-transformer'
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'
import { CreateActivityDto } from './create-activity.dto'

export class CreateActivityTemplateDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	description: string

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CreateActivityDto)
	@ApiPropertyOptional({ type: [CreateActivityDto] })
	activities?: JsonValue
}
