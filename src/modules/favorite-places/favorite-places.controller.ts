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
import {
	CreateFavoritePlaceDto,
	FavoritePlaceQueryParamsDto,
	UpdateFavoritePlaceDto,
} from './dto'
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
	@ApiOperation({
		summary: 'Creación de lugar favorito',
		description: 'Permite agregar un nuevo lugar favorito.',
	})
	@ApiOkResponse({ type: FavoritePlaceEntity })
	create(
		@UserId() userId: string,
		@Body() createFavoritePlaceDto: CreateFavoritePlaceDto
	) {
		return this.favoritePlacesService.create(userId, createFavoritePlaceDto)
	}

	@Get()
	@ApiOperation({
		summary: 'Listado de lugares favoritos',
		description: 'Permite recuperar de forma paginada los lugares favoritos.',
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
	@ApiOperation({
		summary: 'Búsqueda de lugar favorito',
		description: 'Permite buscar un lugar favorito por su ID.',
	})
	@ApiOkResponse({ type: FavoritePlaceEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.favoritePlacesService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualización de lugar favorito',
		description: 'Permite actualizar los datos de un lugar favorito.',
	})
	@ApiOkResponse({ type: FavoritePlaceEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateFavoritePlaceDto: UpdateFavoritePlaceDto
	) {
		return this.favoritePlacesService.update(userId, id, updateFavoritePlaceDto)
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Eliminación de lugar favorito',
		description: 'Permite eliminar un lugar favorito por su ID.',
	})
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.favoritePlacesService.remove(userId, id)
	}
}
