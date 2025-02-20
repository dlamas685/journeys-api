import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateFavoriteAddressDto {
	@ApiPropertyOptional({ example: 'Casa Mamucha' })
	@IsString()
	alias: string

	@ApiPropertyOptional({ example: 'ChIJN1t_tDeuEmsRUsoyG83frY4' })
	@IsString()
	placeId: string
}
