import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Decimal } from '@prisma/client/runtime/library'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateFavoriteAddressDto {
	@ApiProperty({ example: '48 Pirrama Rd, Pyrmont NSW 2009, Australia' })
	@IsString()
	@IsNotEmpty()
	address: string

	@ApiPropertyOptional({ example: 'Casa Mamucha' })
	@IsOptional()
	@IsString()
	alias: string | null

	@ApiPropertyOptional({ example: 'ChIJN1t_tDeuEmsRUsoyG83frY4' })
	@IsOptional()
	@IsString()
	placeId: string | null

	@ApiPropertyOptional({ type: Decimal, example: -33.866489 })
	@IsOptional()
	@IsNumber()
	latitude: Decimal | null

	@ApiPropertyOptional({ type: Decimal, example: 151.1958561 })
	@IsOptional()
	@IsNumber()
	longitude: Decimal | null
}
