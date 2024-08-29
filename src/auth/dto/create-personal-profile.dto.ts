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

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	firstName: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	lastName: string

	@IsOptional()
	@IsDate()
	birthDate?: Date

	@IsOptional()
	@IsPhoneNumber()
	phone?: string

	@IsString()
	@IsOptional()
	address?: string
}
