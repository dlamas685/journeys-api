import { ApiPropertyOptional } from '@nestjs/swagger'
import { Decimal } from '@prisma/client/runtime/library'
import { IsNumber, IsString } from 'class-validator'

export class CreateFavoritePlaceDto {
	@ApiPropertyOptional({ example: '5hdLUM1gGuuAziiu9' })
	@IsString()
	placeId: string

	@ApiPropertyOptional({ type: Decimal, example: -24.7862567 })
	@IsNumber()
	latitude: Decimal

	@ApiPropertyOptional({ type: Decimal, example: -65.4037916 })
	@IsNumber()
	longitude: Decimal
}
