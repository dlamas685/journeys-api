import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator'

export class BoundsDto {
	@IsOptional()
	@IsNumber()
	@Min(14400)
	@Max(28800)
	@IsPositive()
	@ApiPropertyOptional()
	routeDurationLimit?: number

	@IsOptional()
	@IsNumber()
	@Min(1800)
	@Max(14400)
	@IsPositive()
	@ApiPropertyOptional()
	travelDurationLimit?: number

	@IsOptional()
	@IsNumber()
	@Min(5000)
	@Max(5000000)
	@IsPositive()
	@ApiPropertyOptional()
	routeDistanceLimit?: number
}
