import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsUUID,
} from 'class-validator'

export class CreateCompanyProfileDto {
	@IsOptional()
	@IsUUID()
	userId: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	cuit: string

	@ApiProperty()
	@IsPhoneNumber()
	phone: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	taxAddress: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	manager: string

	@ApiProperty()
	@IsEmail()
	managerEmail: string

	@ApiProperty()
	@IsPhoneNumber()
	managerPhone: string
}
