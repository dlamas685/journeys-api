import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class BoundsDto {
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	@ApiPropertyOptional()
	routeDurationLimit?: number

	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	@ApiPropertyOptional()
	travelDurationLimit?: number

	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	@ApiPropertyOptional()
	routeDistanceLimit?: number
}
