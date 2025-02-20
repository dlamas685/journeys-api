import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'

export class BoundsDto {
	@IsOptional()
	@IsNumber()
	@Min(14400)
	@Max(28800)
	@ApiPropertyOptional()
	routeDurationLimit?: number

	@IsOptional()
	@IsNumber()
	@Min(1800)
	@Max(14400)
	@ApiPropertyOptional()
	travelDurationLimit?: number

	@IsOptional()
	@IsNumber()
	@Min(5000)
	@Max(5000000)
	@ApiPropertyOptional()
	routeDistanceLimit?: number
}
