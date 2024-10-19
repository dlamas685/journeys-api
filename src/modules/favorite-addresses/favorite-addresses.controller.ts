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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UserId } from '../../common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import {
	CreateFavoriteAddressDto,
	FavoriteAddressesQueryParamsDto,
	UpdateFavoriteAddressDto,
} from './dto'
import {
	FavoriteAddressEntity,
	FavoriteAddressPaginatedResponseEntity,
} from './entities'
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
	@ApiOkResponse({ type: FavoriteAddressPaginatedResponseEntity })
	findAllTest(
		@UserId() userId: string,
		@Query() queryParamsDto: FavoriteAddressesQueryParamsDto
	) {
		return this.favoriteAddressesService.findAll(userId, queryParamsDto)
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
