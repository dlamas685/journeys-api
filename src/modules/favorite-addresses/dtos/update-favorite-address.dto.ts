import { PartialType } from '@nestjs/swagger'
import { CreateFavoriteAddressDto } from './create-favorite-address.dto'

export class UpdateFavoriteAddressDto extends PartialType(
	CreateFavoriteAddressDto
) {}
