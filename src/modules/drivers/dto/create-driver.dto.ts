import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { DriverEntity } from '../entities/driver.entity'

export class CreateDriverDto {
	@IsOptional()
	@IsUUID()
	@ApiPropertyOptional()
	fleetId: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	licenseNumber: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	imageUrl: string

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	notes: string

	constructor(partial: Partial<DriverEntity>) {
		Object.assign(this, partial)
	}
}
