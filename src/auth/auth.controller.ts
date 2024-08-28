import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import {
	CreateUserDto,
	LoginDto,
	RequestPasswordResetDto,
	ResetPasswordDto,
	ValidateTokenDto,
} from './dto'
import { AuthEntity, SmtpEntity, UserEntity } from './entities'
import { GoogleAuthGuard } from './guards/google-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './services/auth.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private configService: ConfigService
	) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@ApiOperation({
		summary: 'Iniciar sesión',
		description: 'Permite al usuario ingresar a la aplicaión con credenciales',
	})
	@ApiOkResponse({ type: AuthEntity })
	async login(@Req() req, @Body() authDto: LoginDto): Promise<AuthEntity> {
		const { user } = req
		const { rememberMe } = authDto
		const auth = await this.authService.login(user, rememberMe)
		return auth
	}

	@Post('password-reset-request')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Solicitud de cambio de contraseña',
		description: 'Envia un correo electrónico para restablecer la contraseña',
	})
	@ApiOkResponse({ type: SmtpEntity })
	async requestPasswordReset(
		@Body() requestPasswordResetDto: RequestPasswordResetDto
	): Promise<SmtpEntity> {
		return this.authService.requestPasswordReset(requestPasswordResetDto)
	}

	@Post('password-resets')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Restablecimiento de contraseña',
		description: 'Permite el cambio de la contraseña del usuario',
	})
	@ApiOkResponse({ type: UserEntity })
	async resetPassword(
		@Body() resetPasswordDto: ResetPasswordDto
	): Promise<UserEntity> {
		return this.authService.resetPassword(resetPasswordDto)
	}

	@Post('token-validation')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Validación de token',
		description: 'Permite validar un token (mail, password, etc)',
	})
	@ApiOkResponse({ type: AuthEntity })
	async validateToken(
		@Body() validateTokenDto: ValidateTokenDto
	): Promise<AuthEntity> {
		return this.authService.validateToken(validateTokenDto)
	}

	@Get('google/login')
	@UseGuards(GoogleAuthGuard)
	@ApiOperation({
		summary: 'Iniciar sesión con Google',
		description: 'Mostrar la página de inicio de sesión de Google',
	})
	async googleLogin() {}

	@Get('google/redirect')
	@UseGuards(GoogleAuthGuard)
	@ApiOperation({
		summary: 'Redirección de Google',
		description: 'Permite ingresar a la aplicaión con Google',
	})
	@ApiOkResponse({ type: AuthEntity })
	async googleRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
		const error = req.query.error

		if (error) {
			return res.redirect(
				`${this.configService.get('FRONTEND_URL')}/login?error=${error}`
			)
		}

		const auth = await this.authService.login(req.user)

		// const options: CookieOptions = {
		// 	httpOnly: true,
		// 	secure: process.env.NODE_ENV === 'production',
		// 	sameSite: 'lax',
		// 	expires: new Date(auth.expires * 1000),
		// }

		// res.cookie('session.user', JSON.stringify(auth.user), options)

		// res.cookie('session.token', auth.accessToken, options)

		return res.redirect(
			`${this.configService.get('FRONTEND_URL')}/providers?token=${auth.accessToken}`
		)
	}

	@Post('sign-up')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Registro de un nuevo usuario',
		description: 'Permite registrar un nuevo usuario',
	})
	@ApiOkResponse({ type: SmtpEntity })
	async signUp(@Body() createUserDto: CreateUserDto) {
		return this.authService.signUp(createUserDto)
	}

	@Post('email-verification')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Verificación de correo electrónico',
		description:
			'Permite verificar el correo de un usuario. Una vez verificado retorna el jwt para loguearse',
	})
	@ApiOkResponse({ type: UserEntity })
	async verifyEmail(@Body() validateTokenDto: ValidateTokenDto) {
		return this.authService.verifyEmail(validateTokenDto)
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
