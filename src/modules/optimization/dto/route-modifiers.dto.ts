import { protos } from '@googlemaps/routing'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'

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
}
