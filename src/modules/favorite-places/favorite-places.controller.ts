import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import { ApiOkResponsePaginated, UserId } from '../../common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateFavoritePlaceDto } from './dto/create-favorite-place.dto'
import { FavoritePlaceQueryParamsDto } from './dto/favorite-place-params.dto'
import { UpdateFavoritePlaceDto } from './dto/update-favorite-place.dto'
import { FavoritePlaceEntity } from './entities/favorite-place.entity'
import { FavoritePlacesService } from './favorite-places.service'

@Controller('favorite-places')
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
	@ApiOperation({
		summary: 'Listar lugares favoritos del usuario',
	})
	@ApiOkResponsePaginated(FavoritePlaceEntity)
	findAll(
		@UserId() userId: string,
		@Query() queryParamsDto: FavoritePlaceQueryParamsDto
	) {
		return this.favoritePlacesService.findAll(userId, queryParamsDto)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: FavoritePlaceEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.favoritePlacesService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: FavoritePlaceEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateFavoritePlaceDto: UpdateFavoritePlaceDto
	) {
		return this.favoritePlacesService.update(userId, id, updateFavoritePlaceDto)
	}

	@Delete(':id')
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.favoritePlacesService.remove(userId, id)
	}
}
