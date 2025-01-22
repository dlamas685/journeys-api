import { protos } from '@googlemaps/routeoptimization'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsNumber,
	IsOptional,
	IsPositive,
	ValidateNested,
} from 'class-validator'
import { ShipmentDto } from './shipment.dto'
import { TimestampDto } from './timestamp.dto'
import { VehicleDto } from './vehicle.dto'

export class ShipmentModelDto
	implements protos.google.maps.routeoptimization.v1.IShipmentModel
{
	@IsArray()
	@Type(() => ShipmentDto)
	@ValidateNested({ each: true })
	@ApiProperty()
	shipments: ShipmentDto[]

	@IsArray()
	@Type(() => VehicleDto)
	@ValidateNested({ each: true })
	@ApiProperty()
	vehicles: VehicleDto[]

	@IsOptional()
	@Type(() => TimestampDto)
	@ValidateNested()
	@ApiPropertyOptional()
	globalEndTime?: TimestampDto

	@IsOptional()
	@Type(() => TimestampDto)
	@ValidateNested()
	@ApiPropertyOptional()
	globalStartTime?: TimestampDto

	@IsOptional()
	@IsNumber()
	@IsPositive()
	@ApiPropertyOptional()
	globalDurationCostPerHour?: number
}
