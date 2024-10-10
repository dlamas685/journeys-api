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
	UseGuards,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger'
import { UserId } from '../../common/decorators'
import {
	Filtering,
	FilteringParams,
} from '../../common/decorators/filtering-params.decorator'
import {
	Pagination,
	PaginationParams,
} from '../../common/decorators/pagination-params.decorator'
import {
	Sorting,
	SortingParams,
} from '../../common/decorators/sorting-params.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateFavoritePlaceDto } from './dto/create-favorite-place.dto'
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
	@HttpCode(HttpStatus.OK)
	@ApiQuery({ name: 'sort', isArray: true, example: 'name:asc' })
	@ApiQuery({ name: 'filter', isArray: true, example: 'name:like:Av' })
	findAllTest(
		@UserId() userId: string,
		@PaginationParams() paginationParams: Pagination,
		@SortingParams(['name']) sort?: Sorting[],
		@FilteringParams(['name', 'placeType']) filter?: Filtering[]
	) {
		return this.favoritePlacesService.findAll(
			userId,
			paginationParams,
			sort,
			filter
		)
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
