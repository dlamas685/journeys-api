import { ApiPropertyOptional } from '@nestjs/swagger'
import { Decimal } from '@prisma/client/runtime/library'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateFavoritePlaceDto {
	@ApiPropertyOptional({ example: '5hdLUM1gGuuAziiu9' })
	@IsOptional()
	@IsString()
	placeId: string | null

	@ApiPropertyOptional({ type: Decimal, example: -24.7862567 })
	@IsOptional()
	@IsNumber()
	latitude: Decimal | null

	@ApiPropertyOptional({ type: Decimal, example: -65.4037916 })
	@IsOptional()
	@IsNumber()
	longitude: Decimal | null
}
