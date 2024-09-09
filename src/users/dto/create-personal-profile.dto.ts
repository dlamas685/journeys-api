import { ApiProperty } from '@nestjs/swagger'
import {
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsUUID,
} from 'class-validator'

export class CreatePersonalProfileDto {
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
	@IsOptional()
	@IsDate()
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
