import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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

	@ApiPropertyOptional({ examples: ['bar', 'restaurant', 'hotel'] })
	@IsOptional()
	@IsString()
	placeType: string | null

	@ApiPropertyOptional({ type: Decimal, example: -24.7862567 })
	@IsOptional()
	@IsNumber()
	latitude: Decimal | null

	@ApiPropertyOptional({ type: Decimal, example: -65.4037916 })
	@IsOptional()
	@IsNumber()
	longitude: Decimal | null
}
