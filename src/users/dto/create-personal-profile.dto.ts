import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsUUID,
} from 'class-validator'

export class CreatePersonalProfileDto {
	@ApiProperty()
	@IsOptional()
	@IsUUID()
	userId: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	firstName: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	lastName: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	dni?: string

	@ApiProperty()
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	birthDate?: Date

	@ApiProperty()
	@IsOptional()
	@IsPhoneNumber()
	phone?: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	address?: string
}
