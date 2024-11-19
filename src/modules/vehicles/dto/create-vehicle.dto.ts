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
	@ApiPropertyOptional()
	@IsOptional()
	@IsUUID()
	fleetId: string | null

	@ApiProperty({ example: 'AF-000-AA' })
	@IsString()
	@IsNotEmpty()
	licensePlate: string

	@ApiPropertyOptional({ example: 'Toyota' })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	make: string | null

	@ApiPropertyOptional({ example: 'Hilux' })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	model: string | null

	@ApiPropertyOptional({ example: 2021 })
	@IsOptional()
	@IsInt()
	year: number | null

	@ApiPropertyOptional({ example: '4Y1SL65848Z411439' })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	vin: string | null

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	notes: string | null

	constructor(partial: Partial<VehicleEntity>) {
		Object.assign(this, partial)
	}
}
