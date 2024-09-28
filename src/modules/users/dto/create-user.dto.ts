import { ApiProperty } from '@nestjs/swagger'
import { UserType } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	IsDate,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	ValidateNested,
} from 'class-validator'
import { PASSWORD_PATTERN } from 'src/common/constants'
import { CreateCompanyProfileDto } from './create-company-profile.dto'
import { CreatePersonalProfileDto } from './create-personal-profile.dto'

export class CreateUserDto {
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty()
	email: string

	@IsOptional()
	@IsString()
	@Matches(PASSWORD_PATTERN)
	@ApiProperty()
	password?: string

	@IsOptional()
	@IsDate()
	@ApiProperty({ type: Date })
	emailVerified?: Date

	@IsOptional()
	@IsEnum(UserType)
	@ApiProperty({ enum: UserType })
	userType?: UserType

	@IsOptional()
	@IsString()
	@ApiProperty()
	imageUrl?: string

	@IsOptional()
	@ValidateNested()
	@Type(() => CreatePersonalProfileDto)
	@ApiProperty()
	personalProfile?: CreatePersonalProfileDto

	@IsOptional()
	@ValidateNested()
	@Type(() => CreateCompanyProfileDto)
	@ApiProperty()
	companyProfile?: CreateCompanyProfileDto
}
