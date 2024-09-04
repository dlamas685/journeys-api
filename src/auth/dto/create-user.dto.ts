import { ApiProperty } from '@nestjs/swagger'
import { UserType } from '@prisma/client'
import {
	IsDate,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
} from 'class-validator'
import { PASSWORD_PATTERN } from 'src/common/constants'

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
}
