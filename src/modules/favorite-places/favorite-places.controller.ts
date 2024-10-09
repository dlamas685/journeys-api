import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UserId } from '../../common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateFavoritePlaceDto } from './dto/create-favorite-place.dto'
import { UpdateFavoritePlaceDto } from './dto/update-favorite-place.dto'
import { FavoritePlaceEntity } from './entities/favorite-place.entity'
import { FavoritePlacesService } from './favorite-places.service'

@Controller('me/favorite-places')
@UseGuards(JwtAuthGuard)
@ApiTags('Favorite Places')
@ApiBearerAuth('JWT-auth')
export class FavoritePlacesController {
	constructor(private readonly favoritePlacesService: FavoritePlacesService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOkResponse({ type: FavoritePlaceEntity })
	create(
		@UserId() userId: string,
		@Body() createFavoritePlaceDto: CreateFavoritePlaceDto
	) {
		return this.favoritePlacesService.create(userId, createFavoritePlaceDto)
	}

	@Get()
	findAll() {
		return this.favoritePlacesService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.favoritePlacesService.findOne(+id)
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateFavoritePlaceDto: UpdateFavoritePlaceDto
	) {
		return this.favoritePlacesService.update(+id, updateFavoritePlaceDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.favoritePlacesService.remove(+id)
	}
}
