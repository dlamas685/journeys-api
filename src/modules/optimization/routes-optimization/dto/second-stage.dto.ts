import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { ServiceDto } from './service.dto'

export class SecondStageDto {
	@IsNotEmpty()
	@IsArray()
	@Type(() => ServiceDto)
	@ValidateNested({ each: true })
	@ApiProperty({ type: [ServiceDto] })
	services: ServiceDto[]
}
