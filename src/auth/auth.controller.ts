import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import * as bcrypt from 'bcrypt'
import { LoginDocs } from './decorators/login-docs.decorator'
import { LoginDto } from './dto/login.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './services/auth.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@LoginDocs()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	async login(@Request() req, @Body() loginDto: LoginDto) {
		const user = req.user
		const rememberMe = loginDto.rememberMe
		return this.authService.login(user, rememberMe)
	}

	@Get('hash')
	async findHash() {
		const password = 'Hola1234?'

		const salt = await bcrypt.genSalt(10)

		const hash = await bcrypt.hash(password, salt)

		return hash
	}

	/*
	  ? api/auth/login
	  ? api/auth/google
	  ? api/auth/signup
	  ? api/auth/forgot-password
	  ? api/auth/reset-password
	  ? api/auth/verify-email
	  ? api/auth/refresh-token 

	  ! El usuario inicia sesion en la app en la laptop
	  * 1. Revisa si existe el token en la base de datos (si no existe, se crea)
	  * 2. Se envia el token al cliente
	
	*/
}
