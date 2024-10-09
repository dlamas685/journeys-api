import { PartialType } from '@nestjs/swagger'
import { CreateFavoritePlaceDto } from './create-favorite-place.dto'

export class UpdateFavoritePlaceDto extends PartialType(
	CreateFavoritePlaceDto
) {}
