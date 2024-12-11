import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator'

export class ActivitiesJson {
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty()
	id: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	description: string

	@IsNumber()
	@IsOptional()
	@ApiPropertyOptional()
	duration?: number
}

export class CreateActivitiesTemplateDto {
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
	@Type(() => ActivitiesJson)
	@ApiPropertyOptional({ type: [ActivitiesJson] })
	activities?: Prisma.JsonValue
}
