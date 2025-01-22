import { protos } from '@googlemaps/routeoptimization'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsNumber,
	IsOptional,
	IsPositive,
	ValidateNested,
} from 'class-validator'
import { TimestampDto } from './timestamp.dto'

export class TimeWindowDto
	implements protos.google.maps.routeoptimization.v1.ITimeWindow
{
	@IsOptional()
	@ValidateNested()
	@Type(() => TimestampDto)
	@ApiPropertyOptional()
	startTime?: TimestampDto

	@IsOptional()
	@ValidateNested()
	@Type(() => TimestampDto)
	@ApiPropertyOptional()
	endTime?: TimestampDto

	@IsOptional()
	@ValidateNested()
	@Type(() => TimestampDto)
	@ApiPropertyOptional()
	softEndTime?: TimestampDto

	@IsOptional()
	@ValidateNested()
	@Type(() => TimestampDto)
	@ApiPropertyOptional()
	softStartTime?: TimestampDto

	@IsOptional()
	@IsNumber({
		maxDecimalPlaces: 2,
	})
	@IsPositive()
	@ApiPropertyOptional()
	costPerHourAfterSoftEndTime?: number

	@IsOptional()
	@IsNumber({
		maxDecimalPlaces: 2,
	})
	@IsPositive()
	@ApiPropertyOptional()
	costPerHourBeforeSoftStartTime?: number
}
