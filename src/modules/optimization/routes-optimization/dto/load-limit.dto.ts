import { protos } from '@googlemaps/routeoptimization'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class LoadLimitDto
	implements protos.google.maps.routeoptimization.v1.Vehicle.ILoadLimit
{
	@IsOptional()
	@IsNumber()
	@ApiPropertyOptional()
	maxLoad?: number

	@IsOptional()
	@IsNumber()
	@ApiPropertyOptional()
	costPerUnitAboveSoftMax?: number

	@IsOptional()
	@IsNumber()
	@ApiPropertyOptional()
	softMaxLoad?: number
}
