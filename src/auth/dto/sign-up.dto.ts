import { ApiProperty } from '@nestjs/swagger'
import { UserType } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional, ValidateNested } from 'class-validator'
import { CreateCompanyProfileDto } from '../../users/dto/create-company-profile.dto'
import { CreatePersonalProfileDto } from '../../users/dto/create-personal-profile.dto'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import { UpdateCompanyProfileDto } from '../../users/dto/update-company-profile.dto'
import { UpdatePersonalProfileDto } from '../../users/dto/update-personal-profile.dto'

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

export class SignUpLastStepDto {
	@ApiProperty()
	@IsEnum(UserType)
	@ApiProperty({ enum: UserType })
	userType?: UserType

	@ApiProperty()
	@IsOptional()
	@ValidateNested()
	@Type(() => UpdatePersonalProfileDto)
	personalProfile?: UpdatePersonalProfileDto | null

	@ApiProperty()
	@IsOptional()
	@ValidateNested()
	@Type(() => UpdateCompanyProfileDto)
	companyProfile?: UpdateCompanyProfileDto | null
}
