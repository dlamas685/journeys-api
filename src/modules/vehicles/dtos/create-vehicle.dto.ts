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
	fleetId?: string

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
	make?: string

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiPropertyOptional({ example: 'Hilux' })
	model?: string

	@IsOptional()
	@IsInt()
	@ApiPropertyOptional({ example: 2021 })
	year?: number

	@IsOptional()
	@IsString()
	@Matches(VIN_PATTERN, {
		message: 'Invalid VIN format',
	})
	@ApiPropertyOptional({ example: '4Y1SL65848Z411439' })
	vin?: string

	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	notes?: string

	constructor(partial: Partial<VehicleEntity>) {
		Object.assign(this, partial)
	}
}
