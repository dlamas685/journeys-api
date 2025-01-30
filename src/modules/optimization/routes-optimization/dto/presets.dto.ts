import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { FirstStageDto } from './first-stage.dto'
import { SecondStageDto } from './second-stage.dto'

export class PresetsDto {
	@IsNotEmpty()
	@Type(() => FirstStageDto)
	@ValidateNested()
	@ApiProperty({ type: FirstStageDto })
	firstStage: FirstStageDto

	@IsNotEmpty()
	@Type(() => SecondStageDto)
	@ValidateNested()
	@ApiProperty({ type: SecondStageDto })
	secondStage: SecondStageDto
}
