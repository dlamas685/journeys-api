import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateFavoriteAddressDto {
	@ApiPropertyOptional({ example: 'Casa Mamucha' })
	@IsString()
	alias: string

	@ApiPropertyOptional({ example: 'ChIJN1t_tDeuEmsRUsoyG83frY4' })
	@IsString()
	placeId: string

	@ApiPropertyOptional({ example: -33.866489 })
	@IsNumber()
	latitude: number

	@ApiPropertyOptional({ example: 151.1958561 })
	@IsNumber()
	longitude: number
}
