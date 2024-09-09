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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateUserDto, UpdateUserDto, UpdateUserWithProfileDto } from './dto'
import { UserEntity } from './entities/user.entity'
import { UsersService } from './users.service'

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto)
	}

	@Get()
	findAll() {
		return this.usersService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto)
	}

	@Patch(':id/profiles')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Ultimo paso para registrarse',
		description:
			'Permite finalizar el registro de un nuevo usuario mediante provedores como google',
	})
	@ApiOkResponse({ type: UserEntity })
	updateWithProfile(
		@Param('id') id: string,
		@Body() updateUserWithProfileDto: UpdateUserWithProfileDto
	) {
		return this.usersService.updateWithProfile(id, updateUserWithProfileDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(id)
	}
}
