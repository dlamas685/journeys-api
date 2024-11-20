import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator'
import { VehicleEntity } from '../entities/vehicle.entity'

export class CreateVehicleDto {
	@IsOptional()
	@IsUUID()
	@ApiPropertyOptional()
	fleetId: string | null

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	imageUrl: string | null

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: 'AF-000-AA' })
	licensePlate: string

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiPropertyOptional({ example: 'Toyota' })
	make: string | null

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiPropertyOptional({ example: 'Hilux' })
	model: string | null

	@IsOptional()
	@IsInt()
	@ApiPropertyOptional({ example: 2021 })
	year: number | null

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiPropertyOptional({ example: '4Y1SL65848Z411439' })
	vin: string | null

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiPropertyOptional()
	notes: string | null

	constructor(partial: Partial<VehicleEntity>) {
		Object.assign(this, partial)
	}
}
