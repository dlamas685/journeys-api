import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { MailsService } from 'src/common/modules/mails/mails.service'
import { ForgotPasswordDto, ResetPasswordDto, ValidateTokenDto } from '../dto'
import { AuthEntity, SmtpEntity, UserEntity } from '../entities'
import { TokensService } from './tokens.service'
import { UsersService } from './users.service'

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
		private tokens: TokensService,
		private mailsService: MailsService
	) {}

	async validateUser(email: string, password: string): Promise<UserEntity> {
		const user = await this.usersService.findByEmail(email)
		const match = bcrypt.compareSync(password, user.password)

		if (user && match) {
			return new UserEntity(user)
		}
		return null
	}

	async login(user: UserEntity, rememberMe: boolean): Promise<AuthEntity> {
		const accessToken = await this.tokens.create(
			user,
			rememberMe ? '30d' : '1d'
		)

		const expires = this.jwtService.decode(accessToken).exp

		return new AuthEntity({
			accessToken,
			expires,
			user,
		})
	}

	async forgotPassword(
		forgotPasswordDto: ForgotPasswordDto
	): Promise<SmtpEntity> {
		const { email } = forgotPasswordDto

		const user = await this.usersService.findByEmail(email)

		const token = await this.tokens.create(user, '1h')

		const smtp = await this.mailsService.sendPasswordResetEmail(user, token)

		return smtp
	}

	async resetPassword(resetPassword: ResetPasswordDto): Promise<UserEntity> {
		const { password, token } = resetPassword

		const payload = await this.tokens.validate(token)

		const userId = payload.sub

		const user = await this.usersService.update(userId, {
			password: bcrypt.hashSync(password, 10),
		})

		return new UserEntity(user)
	}

	async validateToken(validateTokenDto: ValidateTokenDto): Promise<void> {
		const payload = await this.tokens.validate(validateTokenDto.token)
	}
}
