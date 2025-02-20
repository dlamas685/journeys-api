import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { CreateDriverDto } from './create-driver.dto'

export class UpdateDriverDto extends PartialType(CreateDriverDto) {
	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	imageUrl: string
}
