import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateCompanyProfileDto {
	@IsOptional()
	@IsUUID()
	userId: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	cuit: string

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	entityType?: string
}
