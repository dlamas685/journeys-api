import { protos } from '@googlemaps/routing'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsOptional, ValidateNested } from 'class-validator'
import { TollPass } from '../enums'
import { VehicleInfoDto } from './vehicle-info.dto'

export class RouteModifiersDto
	implements protos.google.maps.routing.v2.IRouteModifiers
{
	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	avoidFerries?: boolean

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	avoidHighways?: boolean

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	avoidTolls?: boolean

	@IsOptional()
	@ValidateNested()
	@Type(() => VehicleInfoDto)
	@ApiPropertyOptional({ type: VehicleInfoDto })
	vehicleInfo?: VehicleInfoDto

	@IsOptional()
	@IsEnum(TollPass, { each: true })
	@ApiPropertyOptional({ enum: TollPass, isArray: true })
	tollPasses?: TollPass[]
}
