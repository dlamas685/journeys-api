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
import { CreateUserDto } from 'src/modules/users/dtos'
import { UserEntity } from 'src/modules/users/entities'
import {
	LoginDto,
	RequestPasswordResetDto,
	ResetPasswordDto,
	ValidateAccessTokenDto,
	VerifyEmailDto,
} from '../dto'
import { AuthEntity, SmtpEntity } from '../entities'
import { GoogleAuthGuard } from '../guards/google-auth.guard'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { AuthService } from '../services/auth.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private auth: AuthService,
		private config: ConfigService
	) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@ApiOperation({
		summary: 'Iniciar sesión',
		description: 'Permite al usuario ingresar a la aplicación con credenciales',
	})
	@ApiOkResponse({ type: AuthEntity })
	async login(@Req() req, @Body() authDto: LoginDto): Promise<AuthEntity> {
		const { user } = req
		const { rememberMe } = authDto
		const auth = await this.auth.login(user, rememberMe)
		return auth
	}

	@Post('password-reset-request')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Solicitud de cambio de contraseña',
		description: 'Envía un correo electrónico para restablecer la contraseña',
	})
	@ApiOkResponse({ type: SmtpEntity })
	async requestPasswordReset(
		@Body() requestPasswordResetDto: RequestPasswordResetDto
	): Promise<SmtpEntity> {
		return this.auth.requestPasswordReset(requestPasswordResetDto)
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
		return this.auth.resetPassword(resetPasswordDto)
	}

	@Post('access-token-validation')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Validación de token de acceso',
		description: 'Permite validar un token de autenticación',
	})
	@ApiOkResponse({ type: AuthEntity })
	async validateAccessToken(
		@Body() validateAccessTokenDto: ValidateAccessTokenDto
	): Promise<AuthEntity> {
		return this.auth.validateAccessToken(validateAccessTokenDto)
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
		description: 'Permite ingresar a la aplicación con Google',
	})
	@ApiOkResponse({ type: AuthEntity })
	async googleRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
		const error = req.query.error

		if (error) {
			return res.redirect(
				`${this.config.get('FRONTEND_URL')}/login?error=${error}`
			)
		}

		const auth = await this.auth.login(req.user)

		return res.redirect(
			`${this.config.get('FRONTEND_URL')}/providers?token=${auth.accessToken}`
		)
	}

	@Post('sign-up')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Registro de un nuevo usuario',
		description: 'Permite registrar un nuevo usuario',
	})
	@ApiOkResponse({ type: AuthEntity })
	async signUp(@Body() createUserDto: CreateUserDto) {
		return this.auth.signUp(createUserDto)
	}

	@Post('email-verification')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Verificación de correo electrónico',
		description: 'Permite verificar el correo de un usuario.',
	})
	@ApiOkResponse({ type: UserEntity })
	async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
		return this.auth.verifyEmail(verifyEmailDto)
	}
}
