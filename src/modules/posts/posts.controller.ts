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
import { ApiOkResponsePaginated, Public, UserId } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ChangePostStatusDto, PostQueryParamsDto } from './dtos'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
import { PostEntity } from './entities/post.entity'
import { PostsService } from './posts.service'

@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiTags('Posts')
@ApiBearerAuth('JWT-auth')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de Publicación',
		description: 'Permite crear una nueva publicación.',
	})
	@ApiOkResponse({ type: PostEntity })
	create(@UserId() userId: string, @Body() createPostDto: CreatePostDto) {
		return this.postsService.create(userId, createPostDto)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Listado de mis publicaciones ',
		description:
			'Permite recuperar las publicaciones realizadas por el usuario.',
	})
	@ApiOkResponsePaginated(PostEntity)
	findAll(
		@UserId() userId: string,
		@Query() queryParamsDto: PostQueryParamsDto
	) {
		return this.postsService.findAll(userId, queryParamsDto)
	}

	@Public()
	@Get('show')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Listado de todas las publicaciones de la comunidad',
		description: 'Permite recuperar todas las publicaciones disponibles',
	})
	@ApiOkResponsePaginated(PostEntity)
	showAll(@Query() queryParamsDto: PostQueryParamsDto) {
		return this.postsService.showAll(queryParamsDto)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Búsqueda de publicación',
		description: 'Permite buscar una publicación por su ID.',
	})
	@ApiOkResponse({ type: PostEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.postsService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Actualización de publicación',
		description: 'Permite actualizar la publicación.',
	})
	@ApiOkResponse({ type: PostEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updatePostDto: UpdatePostDto
	) {
		return this.postsService.update(userId, id, updatePostDto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Eliminación de publicación',
		description: 'Permite eliminar una publicación.',
	})
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.postsService.remove(userId, id)
	}

	@Post('change-status')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Cambia el estado de una publicación',
	})
	@ApiOkResponse({ type: PostEntity })
	changeStatus(
		@UserId() userId: string,
		@Body() changeTripStatusDto: ChangePostStatusDto
	) {
		return this.postsService.changeStatus(userId, changeTripStatusDto)
	}
}
