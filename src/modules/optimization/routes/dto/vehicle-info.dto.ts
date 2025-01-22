import { protos } from '@googlemaps/routing'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { VehicleEmissionType } from '../enums'

export class VehicleInfoDto
	implements protos.google.maps.routing.v2.IVehicleInfo
{
	@IsString()
	@IsEnum(VehicleEmissionType)
	@IsOptional()
	@ApiPropertyOptional({ enum: VehicleEmissionType })
	emissionType?: VehicleEmissionType
}
