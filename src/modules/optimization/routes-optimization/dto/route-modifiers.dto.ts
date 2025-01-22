import { protos } from '@googlemaps/routeoptimization'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'

export class RouteModifiersDto
	implements protos.google.maps.routeoptimization.v1.IRouteModifiers
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
	avoidIndoor?: boolean

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	avoidTolls?: boolean
}
