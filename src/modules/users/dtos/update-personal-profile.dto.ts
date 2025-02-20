import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsPhoneNumber, IsString } from 'class-validator'
import { CreatePersonalProfileDto } from './create-personal-profile.dto'

export class UpdatePersonalProfileDto extends PartialType(
	CreatePersonalProfileDto
) {
	@IsString()
	@IsOptional()
	@ApiProperty()
	dni?: string

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	@ApiProperty()
	birthDate?: Date

	@IsOptional()
	@IsPhoneNumber()
	@ApiProperty()
	phone?: string

	@IsString()
	@IsOptional()
	@ApiProperty()
	address?: string
}
