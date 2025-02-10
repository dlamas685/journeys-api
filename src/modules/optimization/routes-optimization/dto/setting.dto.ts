import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { FirstStageDto } from './first-stage.dto'
import { SecondStageDto } from './second-stage.dto'
import { ThirdStageDto } from './third-stage.dto'

export class SettingDto {
	@Type(() => FirstStageDto)
	@ValidateNested()
	@ApiProperty({ type: FirstStageDto })
	firstStage: FirstStageDto

	@Type(() => SecondStageDto)
	@ValidateNested()
	@ApiProperty({ type: SecondStageDto })
	secondStage: SecondStageDto

	@IsOptional()
	@Type(() => ThirdStageDto)
	@ValidateNested()
	@ApiPropertyOptional({ type: ThirdStageDto })
	thirdStage?: ThirdStageDto
}
