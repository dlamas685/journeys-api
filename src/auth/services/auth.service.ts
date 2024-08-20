import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { plainToClass } from 'class-transformer'
import { MailsService } from 'src/common/modules/mails/mails.service'
import { PrismaService } from 'src/common/services/prisma.service'
import {
	CreateAccountDto,
	CreateUserDto,
	ForgotPasswordDto,
	ResetPasswordDto,
	ValidateTokenDto,
} from '../dto'
import { AuthEntity, GoogleEntity, SmtpEntity, UserEntity } from '../entities'
import { AccountsService } from './accounts.service'
import { TokensService } from './tokens.service'
import { UsersService } from './users.service'

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
		private accountsService: AccountsService,
		private tokens: TokensService,
		private mailsService: MailsService,
		private prismaService: PrismaService
	) {}

	async validateUser(email: string, password: string): Promise<UserEntity> {
		const user = await this.usersService.findByEmail(email)
		const match = bcrypt.compareSync(password, user.password)

		if (user && match) {
			return new UserEntity(user)
		}
		return null
	}

	async validateGoogleUser(google: GoogleEntity): Promise<UserEntity> {
		const {
			providerAccountId,
			provider,
			email,
			imageUrl,
			accessToken,
			refreshToken,
		} = google

		const account = await this.accountsService.findOne(
			providerAccountId,
			provider
		)

		if (account) {
			return new UserEntity(account.user)
		}

		const user = await this.usersService.findByEmail(email)

		const createAccountDto = plainToClass(CreateAccountDto, {
			providerAccountId,
			provider,
			accessToken,
			refreshToken,
		})

		if (user) {
			await this.prismaService.$transaction(async () => {
				await this.accountsService.create({
					...createAccountDto,
					userId: user.id,
				})

				await this.usersService.update(user.id, {
					imageUrl: user.imageUrl ?? imageUrl,
					emailVerified: new Date(),
				})
			})

			return new UserEntity(user)
		}

		const createUserDto = plainToClass(CreateUserDto, {
			email,
			imageUrl,
			emailVerified: new Date(),
		})

		const newUser = await this.usersService.createUserAccount(
			createUserDto,
			createAccountDto
		)

		return new UserEntity(newUser)
	}

	async login(
		user: UserEntity,
		rememberMe: boolean = false
	): Promise<AuthEntity> {
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

	async hashPassword(password: string) {
		const salt = await bcrypt.genSalt(10)
		return await bcrypt.hash(password, salt)
	}

	async signUpUser(createUserDto: CreateUserDto) {
		const user = await this.usersService.create(createUserDto)
		const token = await this.tokens.create(user, '1h')

		const smtpMessage = await this.mailsService.sendVerifyEmail(user, token)
		return {
			message: smtpMessage,
		}
	}

	async verifyEmail(validateTokenDto: ValidateTokenDto): Promise<AuthEntity> {
		const payload = await this.tokens.validate(validateTokenDto.token)
		const userId = payload.sub

		const user = await this.usersService.update(userId, {
			emailVerified: new Date(),
		})

		return await this.login(user, false)
	}
}
