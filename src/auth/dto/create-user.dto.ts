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

	@IsString()
	@Matches(PASSWORD_PATTERN)
	@IsOptional()
	@ApiProperty()
	password?: string

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string

	@IsEnum(UserType)
	@ApiProperty({ enum: UserType, default: UserType.PERSONAL })
	userType: UserType = UserType.PERSONAL

	@IsOptional()
	@IsDate()
	@ApiProperty({ type: Date })
	emailVerified: Date

	@IsOptional()
	@IsString()
	@ApiProperty()
	imageUrl: string
}
