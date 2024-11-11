import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateFavoriteAddressDto {
	@ApiPropertyOptional({ example: 'Casa Mamucha' })
	@IsOptional()
	@IsString()
	alias: string | null

	@ApiPropertyOptional({ example: 'ChIJN1t_tDeuEmsRUsoyG83frY4' })
	@IsOptional()
	@IsString()
	placeId: string | null

	@ApiPropertyOptional({ example: -33.866489 })
	@IsOptional()
	@IsNumber()
	latitude: number | null

	@ApiPropertyOptional({ example: 151.1958561 })
	@IsOptional()
	@IsNumber()
	longitude: number | null
}
