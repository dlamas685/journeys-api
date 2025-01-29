import { ApiProperty, OmitType } from '@nestjs/swagger'
import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPhoneNumber,
	IsPositive,
	IsString,
	IsUUID,
} from 'class-validator'

export class CreatePostDto {
	@IsNotEmpty()
	@IsUUID()
	@ApiProperty()
	tripId: string

	@IsOptional()
	@ApiProperty()
	@IsBoolean()
	isPublic: boolean = true

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	destination: string

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	cityTown: string

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	carrierName: string

	@IsNotEmpty()
	@IsPhoneNumber()
	@ApiProperty()
	carrierPhone: string

	@IsNumber()
	@IsPositive()
	@ApiProperty()
	pricePerKg: number

	@IsNumber()
	@IsPositive()
	@ApiProperty()
	pricePerPostal: number

	@IsNumber()
	@IsPositive()
	@ApiProperty()
	maxCapacityKg: number

	@IsOptional()
	@IsNumber()
	@ApiProperty()
	currentFillingKg: number = 0
}

export class CreatePostFromTripDto extends OmitType(CreatePostDto, [
	'tripId',
]) {}
