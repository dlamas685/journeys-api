import { ApiProperty } from '@nestjs/swagger'
import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsPhoneNumber,
	IsString,
	IsUUID,
} from 'class-validator'

export class CreatePostDto {
	@IsNotEmpty()
	@IsUUID()
	@ApiProperty()
	tripId: string

	@ApiProperty()
	@IsBoolean()
	isPublic: boolean

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
	@ApiProperty()
	pricePerKg: number

	@IsNumber()
	@ApiProperty()
	pricePerPostal: number

	@IsNumber()
	@ApiProperty()
	maxCapacityKg: number

	@IsNumber()
	@ApiProperty()
	currentFillingKg: number
}
