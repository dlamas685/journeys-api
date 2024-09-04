import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { CreateCompanyProfileDto } from './create-company-profile.dto'
import { CreatePersonalProfileDto } from './create-personal-profile.dto'
import { CreateUserDto } from './create-user.dto'

export class SignUpDto {
	@ApiProperty()
	@ValidateNested()
	@Type(() => CreateUserDto)
	user: CreateUserDto

	@ApiProperty()
	@IsOptional()
	@ValidateNested()
	@Type(() => CreatePersonalProfileDto)
	personalProfile?: CreatePersonalProfileDto | null

	@ApiProperty()
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateCompanyProfileDto)
	companyProfile?: CreateCompanyProfileDto | null
}
