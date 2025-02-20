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

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	sideOfRoad?: boolean
}
