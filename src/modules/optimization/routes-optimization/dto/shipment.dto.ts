import { protos } from '@googlemaps/routeoptimization'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsOptional,
	IsPositive,
	IsString,
	Length,
	ValidateNested,
} from 'class-validator'
import { LoadDto } from './load.dto'
import { VisitRequestDto } from './visit-request.dto'

export class ShipmentDto
	implements protos.google.maps.routeoptimization.v1.IShipment
{
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => VisitRequestDto)
	@ApiProperty()
	deliveries: VisitRequestDto[]

	@IsOptional()
	@IsString()
	@Length(1, 63)
	@ApiPropertyOptional()
	displayName?: string

	@ValidateNested({ each: true })
	@IsOptional()
	@Type(() => VisitRequestDto)
	@ApiPropertyOptional()
	pickups?: VisitRequestDto[]

	@IsOptional()
	@IsArray()
	@IsNumber(
		{
			maxDecimalPlaces: 2,
		},
		{ each: true }
	)
	@IsPositive({ each: true })
	@ApiPropertyOptional()
	costsPerVehicle?: number[]

	@IsOptional()
	@IsArray()
	@IsNumber(
		{
			maxDecimalPlaces: 2,
		},
		{ each: true }
	)
	@IsPositive({ each: true })
	@ApiPropertyOptional()
	costsPerVehicleIndices?: number[]

	@IsOptional()
	@IsNumber({
		maxDecimalPlaces: 2,
	})
	@IsPositive()
	@ApiPropertyOptional()
	penaltyCost?: number

	@IsOptional()
	@IsArray()
	@IsNumber({}, { each: true })
	@IsPositive({ each: true })
	@ApiPropertyOptional()
	allowedVehicleIndices?: number[]

	@IsOptional()
	@IsObject()
	@ValidateNested({ each: true })
	@Type(() => LoadDto)
	@ApiPropertyOptional()
	loadDemands?: {
		[k: string]: LoadDto
	}
}
