import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'

export class CostModelDto {
	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@Max(999)
	@ApiPropertyOptional()
	fixedCost?: number

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(999)
	@ApiPropertyOptional()
	costPerHour?: number

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@Max(999)
	@ApiPropertyOptional()
	costPerKilometer?: number

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@Max(999)
	@ApiPropertyOptional()
	costPerTraveledHour?: number

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 1 })
	@Min(0.5)
	@Max(2)
	@ApiPropertyOptional()
	travelDurationMultiple?: number
}
