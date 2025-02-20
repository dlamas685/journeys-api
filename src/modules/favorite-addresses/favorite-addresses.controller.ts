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
	CreateFavoriteAddressDto,
	FavoriteAddressQueryParamsDto,
	UpdateFavoriteAddressDto,
} from './dtos'
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
	@ApiOperation({
		summary: 'Creación de dirección favorita',
		description: 'Permite agregar una nueva dirección favorita.',
	})
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
	@ApiOperation({
		summary: 'Listado de direcciones favoritas',
		description:
			'Permite recuperar de forma paginada las direcciones favoritas.',
	})
	@ApiOkResponsePaginated(FavoriteAddressEntity)
	findAll(
		@UserId() userId: string,
		@Query() queryParamsDto: FavoriteAddressQueryParamsDto
	) {
		return this.favoriteAddressesService.findAll(userId, queryParamsDto)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Buscar dirección favorita',
		description: 'Permite buscar una dirección favorita por su ID.',
	})
	@ApiOkResponse({ type: FavoriteAddressEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.favoriteAddressesService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualización de dirección favorita',
		description: 'Permite actualizar los datos de una dirección favorita.',
	})
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
	@ApiOperation({
		summary: 'Eliminación de dirección favorita',
		description: 'Permite eliminar una dirección favorita por su ID.',
	})
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.favoriteAddressesService.remove(userId, id)
	}
}
