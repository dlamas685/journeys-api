import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateFavoritePlaceDto {
	@ApiProperty({ example: 'Cerveza Patagonia - Refugio Salta' })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiPropertyOptional({ example: '5hdLUM1gGuuAziiu9' })
	@IsOptional()
	@IsString()
	placeId: string | null

	@ApiPropertyOptional({ example: 'Juramento 334, A4400 Salta' })
	@IsOptional()
	@IsString()
	address: string

	@ApiPropertyOptional({
		examples: [
			'lodging',
			'restaurant',
			'food',
			'point_of_interest',
			'establishment',
		],
	})
	@IsOptional()
	types: Prisma.JsonValue | null

	@ApiPropertyOptional({
		example:
			'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/lodging-71.png',
	})
	@IsOptional()
	@IsString()
	iconUrl: string

	@ApiPropertyOptional({ type: Decimal, example: -24.7862567 })
	@IsOptional()
	@IsNumber()
	latitude: Decimal | null

	@ApiPropertyOptional({ type: Decimal, example: -65.4037916 })
	@IsOptional()
	@IsNumber()
	longitude: Decimal | null
}
