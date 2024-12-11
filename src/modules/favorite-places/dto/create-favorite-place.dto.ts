import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateFavoritePlaceDto {
	@ApiPropertyOptional({ example: '5hdLUM1gGuuAziiu9' })
	@IsString()
	placeId: string

	@ApiPropertyOptional({ example: -24.7862567 })
	@IsNumber()
	latitude: number

	@ApiPropertyOptional({ example: -65.4037916 })
	@IsNumber()
	longitude: number
}
