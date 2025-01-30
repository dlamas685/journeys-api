import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'
import { LocationDto } from './location.dto'

export class WaypointDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	placeId: string

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	address: string

	@IsNotEmpty()
	@Type(() => LocationDto)
	@ValidateNested()
	@ApiProperty()
	location: LocationDto

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	sideOfRoad?: boolean
}
