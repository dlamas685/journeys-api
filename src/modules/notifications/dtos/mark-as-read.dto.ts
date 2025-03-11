import { ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsArray,
	IsBoolean,
	IsOptional,
	IsUUID,
	ValidateIf,
} from 'class-validator'

export class MarkAsReadDto {
	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	markAll?: boolean = false

	@ValidateIf(o => o.markAll === false)
	@IsArray()
	@IsUUID('4', { each: true })
	@ApiPropertyOptional()
	ids?: string[]
}
