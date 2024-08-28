import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { plainToClass } from 'class-transformer'
import { MailsService } from 'src/common/modules/mails/mails.service'
import { PrismaService } from 'src/common/services/prisma.service'
import {
	CreateAccountDto,
	CreateUserDto,
	RequestPasswordResetDto,
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

		if (user) {
			const match = bcrypt.compareSync(password, user.password)

			if (match) return new UserEntity(user)
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
			const udatedUser = await this.prismaService.$transaction(async prisma => {
				prisma.account.create({
					data: {
						...createAccountDto,
						userId: user.id,
					},
				})

				return prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						imageUrl: user.imageUrl ?? imageUrl,
						emailVerified: new Date(),
					},
					include: {
						companyProfile: true,
						personalProfile: true,
						accounts: true,
					},
				})
			})

			return new UserEntity(udatedUser)
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

	async requestPasswordReset(
		requestPasswordResetDto: RequestPasswordResetDto
	): Promise<SmtpEntity> {
		const { email } = requestPasswordResetDto

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

	async validateToken(validateTokenDto: ValidateTokenDto): Promise<AuthEntity> {
		const payload = await this.tokens.validate(validateTokenDto.token)

		const user = await this.usersService.findOne(payload.sub)

		return new AuthEntity({
			accessToken: validateTokenDto.token,
			expires: payload.exp,
			user,
		})
	}

	async hashPassword(password: string) {
		const salt = await bcrypt.genSalt(10)
		return await bcrypt.hash(password, salt)
	}

	async signUp(createUserDto: CreateUserDto): Promise<SmtpEntity> {
		const user = await this.usersService.create(createUserDto)

		const token = await this.tokens.create(user, '1h')

		const smtp = await this.mailsService.sendVerificationEmail(user, token)

		return smtp
	}

	async verifyEmail(validateTokenDto: ValidateTokenDto): Promise<UserEntity> {
		const payload = await this.tokens.validate(validateTokenDto.token)
		const userId = payload.sub

		const user = await this.usersService.update(userId, {
			emailVerified: new Date(),
		})

		return user
	}
}
