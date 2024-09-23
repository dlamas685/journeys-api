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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { GetCurrentUserById } from './../common/decorators'
import { CreateFavoriteAddressDto } from './dto/create-favorite-address.dto'
import { UpdateFavoriteAddressDto } from './dto/update-favorite-address.dto'
import { FavoriteAddressEntity } from './entities/favorite-address.entity'
import { FavoriteAddressesService } from './favorite-addresses.service'

@Controller('me/favorite-addresses')
@UseGuards(JwtAuthGuard)
@ApiTags('Favourite Addresses')
@ApiBearerAuth('JWT-auth')
export class FavoriteAddressesController {
	constructor(
		private readonly favoriteAddressesService: FavoriteAddressesService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOkResponse({ type: FavoriteAddressEntity })
	create(
		@GetCurrentUserById() userId: string,
		@Body() createFavoriteAddressDto: CreateFavoriteAddressDto
	) {
		return this.favoriteAddressesService.create(
			userId,
			createFavoriteAddressDto
		)
	}

	@Get()
	findAll(@GetCurrentUserById() userId: string) {
		return this.favoriteAddressesService.findAll(userId)
	}

	@Get(':id')
	findOne(@GetCurrentUserById() userId: string, @Param('id') id: string) {
		return this.favoriteAddressesService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: FavoriteAddressEntity })
	update(
		@GetCurrentUserById() userId: string,
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
	remove(
		@GetCurrentUserById() userId: string,
		@Param('id', ParseUUIDPipe) id: string
	) {
		return this.favoriteAddressesService.remove(userId, id)
	}
}
