import { protos } from '@googlemaps/routeoptimization'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsPositive } from 'class-validator'

export class LoadDto
	implements protos.google.maps.routeoptimization.v1.Shipment.ILoad
{
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	@ApiPropertyOptional()
	amount?: number
}
