import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { FirstStageDto } from './first-stage.dto'
import { SecondStageDto } from './second-stage.dto'
import { ThirdStageDto } from './third-stage.dto'

export class SettingDto {
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

	@IsOptional()
	@Type(() => ThirdStageDto)
	@ValidateNested()
	@ApiPropertyOptional({ type: ThirdStageDto })
	thirdStage?: ThirdStageDto
}
