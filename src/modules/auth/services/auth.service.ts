import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { plainToClass } from 'class-transformer'
import { EmailsService } from 'src/modules/mails/mails.service'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { UserEntity } from 'src/modules/users/entities'
import { v4 as uuid } from 'uuid'
import { CreateUserDto } from '../../users/dtos'
import { UsersService } from '../../users/users.service'
import {
	CreateAccountDto,
	RequestPasswordResetDto,
	ResetPasswordDto,
	ValidateAccessTokenDto,
	VerifyEmailDto,
} from '../dto'
import { AuthEntity, GoogleEntity, SmtpEntity } from '../entities'
import { AccountsService } from './accounts.service'
import { TokensService } from './tokens.service'
import { VerificationTokensService } from './verification-tokens.service'

@Injectable()
export class AuthService {
	private readonly salts: number

	constructor(
		private readonly jwt: JwtService,
		private readonly prisma: PrismaService,
		private readonly tokens: TokensService,
		private readonly verificationTokens: VerificationTokensService,
		private readonly users: UsersService,
		private readonly accounts: AccountsService,
		private readonly mails: EmailsService,
		private readonly config: ConfigService
	) {
		this.salts = this.config.get<number>('SALTS')
	}

	async validateUser(email: string, password: string): Promise<UserEntity> {
		const user = await this.users.findByEmail(email)

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

		const account = await this.accounts.findOne(providerAccountId, provider)

		if (account) {
			return new UserEntity(account.user)
		}

		const user = await this.users.findByEmail(email)

		const createAccountDto = plainToClass(CreateAccountDto, {
			providerAccountId,
			provider,
			accessToken,
			refreshToken,
		})

		if (user) {
			const updatedUser = await this.prisma.$transaction(async prisma => {
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

			return new UserEntity(updatedUser)
		}

		const createUserDto = plainToClass(CreateUserDto, {
			email,
			imageUrl,
			emailVerified: new Date(),
		})

		const newUser = await this.users.createUserAccount(
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

		const expires = this.jwt.decode(accessToken).exp

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

		const user = await this.users.findByEmail(email)

		if (!user) throw new NotFoundException('Usuario no encontrado')

		const token = uuid()

		const smtp = await this.prisma.$transaction(async prisma => {
			await prisma.verificationToken.create({
				data: {
					token,
					identifier: email,
					expires: new Date(Date.now() + 10 * 60 * 1000),
				},
			})

			return await this.mails.sendPasswordResetEmail(user, token)
		})

		return smtp
	}

	async resetPassword(resetPassword: ResetPasswordDto): Promise<UserEntity> {
		const { password, token, email } = resetPassword

		const { identifier } = await this.verificationTokens.findOne(token, email)

		const user = await this.users.findByEmail(identifier)

		if (!user) throw new NotFoundException('Usuario no encontrado')

		const { id } = user

		const updatedUser = await this.prisma.$transaction(async prisma => {
			const user = await prisma.user.update({
				where: {
					id,
				},
				data: {
					password: bcrypt.hashSync(password, this.salts),
				},
				include: {
					companyProfile: true,
					personalProfile: true,
				},
			})

			await prisma.verificationToken.deleteMany({
				where: {
					identifier,
					token,
				},
			})

			return user
		})

		return new UserEntity(updatedUser)
	}

	async validateAccessToken(
		validateAccessTokenDto: ValidateAccessTokenDto
	): Promise<AuthEntity> {
		const payload = await this.tokens.validate(validateAccessTokenDto.token)

		const user = await this.users.findOne(payload.sub)

		return new AuthEntity({
			accessToken: validateAccessTokenDto.token,
			expires: payload.exp,
			user,
		})
	}

	async signUp(createUserDto: CreateUserDto): Promise<AuthEntity> {
		const createdUser = await this.users.create(createUserDto)

		const token = uuid()

		await this.prisma.$transaction(async prisma => {
			const createdVerificationToken = await prisma.verificationToken.create({
				data: {
					token,
					identifier: createdUser.email,
					expires: new Date(Date.now() + 10 * 60 * 1000),
				},
			})

			await this.mails.sendVerificationEmail(
				createdUser,
				createdVerificationToken.token
			)

			return createdUser
		})

		const accessToken = await this.tokens.create(createdUser, '1h')

		return new AuthEntity({
			accessToken,
			expires: this.jwt.decode(accessToken).exp,
			user: new UserEntity(createdUser),
		})
	}

	async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<UserEntity> {
		const { token, email } = verifyEmailDto

		const { identifier } = await this.verificationTokens.findOne(token, email)

		const user = await this.users.findByEmail(identifier)

		if (!user) throw new NotFoundException('Usuario no encontrado')

		const { id } = user

		const updatedUser = await this.prisma.$transaction(async prisma => {
			const user = await prisma.user.update({
				data: {
					emailVerified: new Date(),
				},
				where: {
					id,
				},
				include: {
					companyProfile: true,
					personalProfile: true,
				},
			})

			await prisma.verificationToken.deleteMany({
				where: {
					identifier,
					token,
				},
			})

			return user
		})

		return new UserEntity(updatedUser)
	}
}
