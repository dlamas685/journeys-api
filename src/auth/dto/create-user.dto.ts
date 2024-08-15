import { ApiProperty } from '@nestjs/swagger'
import { CompanyProfile, PersonalProfile, UserType } from '@prisma/client'
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
	@ApiProperty()
	@IsString()
	@IsEmail()
	email: string

	@ApiProperty()
	@IsString()
	password: string

	@ApiProperty()
	@IsEnum(UserType)
	userType: UserType

	@IsOptional()
	personalProfile?: PersonalProfile

	@IsOptional()
	companyProfile?: CompanyProfile
}
