import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	ValidateNested,
} from 'class-validator'
import { LocationDto } from './location.dto'

export class WaypointDto {
	@IsNotEmpty()
	@ApiProperty()
	placeId: string

	@IsNotEmpty()
	@ApiProperty()
	address: string

	@Type(() => LocationDto)
	@ValidateNested()
	@ApiProperty()
	location: LocationDto

	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	vehicleStopover?: boolean = false

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	via?: boolean = false

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	sideOfRoad?: boolean = false
}
