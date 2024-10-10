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
import { CreateFavoriteAddressDto } from './dto/create-favorite-address.dto'
import { UpdateFavoriteAddressDto } from './dto/update-favorite-address.dto'
import { FavoriteAddressEntity } from './entities/favorite-address.entity'
import { FavoriteAddressesService } from './favorite-addresses.service'

@Controller('favorite-addresses')
@UseGuards(JwtAuthGuard)
@ApiTags('Favorite Addresses')
@ApiBearerAuth('JWT-auth')
export class FavoriteAddressesController {
	constructor(
		private readonly favoriteAddressesService: FavoriteAddressesService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOkResponse({ type: FavoriteAddressEntity })
	create(
		@UserId() userId: string,
		@Body() createFavoriteAddressDto: CreateFavoriteAddressDto
	) {
		return this.favoriteAddressesService.create(
			userId,
			createFavoriteAddressDto
		)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiQuery({ name: 'sort', isArray: true, example: 'address:asc' })
	@ApiQuery({ name: 'filter', isArray: true, example: 'address:like:Av' })
	findAllTest(
		@UserId() userId: string,
		@PaginationParams() paginationParams: Pagination,
		@SortingParams(['address', 'alias']) sort?: Sorting[],
		@FilteringParams(['address', 'alias']) filter?: Filtering[]
	) {
		return this.favoriteAddressesService.findAll(
			userId,
			paginationParams,
			sort,
			filter
		)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: FavoriteAddressEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.favoriteAddressesService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: FavoriteAddressEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateFavoriteAddressDto: UpdateFavoriteAddressDto
	) {
		return this.favoriteAddressesService.update(
			userId,
			id,
			updateFavoriteAddressDto
		)
	}

	@Delete(':id')
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.favoriteAddressesService.remove(userId, id)
	}
}
