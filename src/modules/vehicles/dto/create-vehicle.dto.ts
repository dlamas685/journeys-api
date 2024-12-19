import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Matches,
} from 'class-validator'
import { LICENSE_PLATE_PATTERN, VIN_PATTERN } from 'src/common/constants'
import { VehicleEntity } from '../entities/vehicle.entity'

export class CreateVehicleDto {
	@IsOptional()
	@IsUUID()
	@ApiPropertyOptional()
	fleetId: string | null

	@IsString()
	@IsNotEmpty()
	@Matches(LICENSE_PLATE_PATTERN, {
		message: 'Invalid licensePlate format',
	})
	@ApiProperty({ example: 'AF-000-AA' })
	licensePlate: string

	@IsOptional()
	@IsString()
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

	@IsString()
	@IsNotEmpty()
	@Matches(VIN_PATTERN, {
		message: 'Invalid VIN format',
	})
	@ApiPropertyOptional({ example: '4Y1SL65848Z411439' })
	vin: string | null

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	notes: string | null

	constructor(partial: Partial<VehicleEntity>) {
		Object.assign(this, partial)
	}
}
