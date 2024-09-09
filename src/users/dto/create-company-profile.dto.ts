import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

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
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	entityType?: string
}
