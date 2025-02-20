import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateFavoritePlaceDto {
	@ApiPropertyOptional({ example: '5hdLUM1gGuuAziiu9' })
	@IsString()
	placeId: string
}
