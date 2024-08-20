import {
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsUUID,
} from 'class-validator'

export class CreatePersonalProfileDto {
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@IsString()
	@IsNotEmpty()
	firstName: string

	@IsString()
	@IsNotEmpty()
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
