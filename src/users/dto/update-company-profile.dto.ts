import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator'
import { CreateCompanyProfileDto } from './create-company-profile.dto'

export class UpdateCompanyProfileDto extends PartialType(
	CreateCompanyProfileDto
) {
	@IsPhoneNumber()
	@IsOptional()
	@ApiProperty()
	phone?: string

	@IsString()
	@IsOptional()
	@ApiProperty()
	taxAddress?: string

	@IsEmail()
	@IsOptional()
	@ApiProperty()
	managerEmail?: string

	@IsPhoneNumber()
	@IsOptional()
	@ApiProperty()
	managerPhone?: string
}
