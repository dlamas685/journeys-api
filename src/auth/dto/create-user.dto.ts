import { ApiProperty } from '@nestjs/swagger'
import { UserType } from '@prisma/client'
import {
	IsDate,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Matches,
} from 'class-validator'
import { PASSWORD_PATTERN } from 'src/common/constants'

export class CreateUserDto {
	@IsOptional()
	@IsUUID()
	userId: string

	@IsOptional()
	@IsString()
	@Matches(PASSWORD_PATTERN)
	@ApiProperty()
	password?: string

	@IsNotEmpty()
	@IsEmail()
	@ApiProperty()
	email: string

	@IsOptional()
	@IsEnum(UserType)
	@ApiProperty({ enum: UserType })
	userType?: UserType

	@IsOptional()
	@IsDate()
	@ApiProperty({ type: Date })
	emailVerified: Date

	@IsOptional()
	@IsString()
	@ApiProperty()
	imageUrl: string
}
