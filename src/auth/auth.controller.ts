import { Body, Controller, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
	EmailVerification,
	ForgotPassword,
	GoogleLogin,
	GoogleRedirect,
	Login,
	ResetPassword,
	SignUp,
	ValidateToken,
} from './decorators'
import {
	CreateUserDto,
	ForgotPasswordDto,
	LoginDto,
	ResetPasswordDto,
	ValidateTokenDto,
} from './dto'
import { AuthEntity, SmtpEntity, UserEntity } from './entities'
import { AuthService } from './services/auth.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Login()
	async login(@Request() req, @Body() authDto: LoginDto): Promise<AuthEntity> {
		const user = req.user
		const rememberMe = authDto.rememberMe

		return this.authService.login(user, rememberMe)
	}

	@ForgotPassword()
	async forgotPassword(
		@Body() forgotPasswordDto: ForgotPasswordDto
	): Promise<SmtpEntity> {
		return this.authService.forgotPassword(forgotPasswordDto)
	}

	@ResetPassword()
	async resetPassword(
		@Body() resetPasswordDto: ResetPasswordDto
	): Promise<UserEntity> {
		return this.authService.resetPassword(resetPasswordDto)
	}

	@ValidateToken()
	async validateToken(
		@Body() validateTokenDto: ValidateTokenDto
	): Promise<void> {
		return this.authService.validateToken(validateTokenDto)
	}

	@GoogleLogin()
	async googleLogin() {}

	@GoogleRedirect()
	async googleRedirect(@Request() req) {
		return this.authService.login(req.user)
	}

	@SignUp()
	async signUp(@Body() createUserDto: CreateUserDto) {
		return this.authService.signUpUser(createUserDto)
	}

	@EmailVerification()
	async emailVerification(@Body() validateTokenDto: ValidateTokenDto) {
		return this.authService.emailVerification(validateTokenDto)
	}

	/*
	  ? api/auth/login (*)
	  ? api/auth/google (*)
	  ? api/auth/signup
	  ? api/auth/forgot-password (*)
	  ? api/auth/reset-password (*)
	  ? api/auth/verify-email
	  ? api/auth/validate-token (*)

	  ! El usuario inicia sesion en la app en la laptop
	  * 1. Revisa si existe el token en la base de datos (si no existe, se crea)
	  * 2. Se envia el token al cliente
	
	*/
}
