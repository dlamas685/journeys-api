import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { plainToClass } from 'class-transformer'
import { MailsService } from 'src/common/modules/mails/mails.service'
import { PrismaService } from 'src/common/services/prisma.service'
import { v4 as uuid } from 'uuid'
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
import { VerificationTokensService } from './verification-tokens.service'

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private users: UsersService,
		private accounts: AccountsService,
		private tokens: TokensService,
		private mails: MailsService,
		private prisma: PrismaService,
		private verificationTokens: VerificationTokensService
	) {}

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
			const udatedUser = await this.prisma.$transaction(async prisma => {
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
					password: bcrypt.hashSync(password, 10),
				},
				include: {
					companyProfile: true,
					personalProfile: true,
				},
			})

			await prisma.verificationToken.deleteMany({
				where: {
					identifier,
				},
			})

			return user
		})

		return new UserEntity(updatedUser)
	}

	async validateToken(validateTokenDto: ValidateTokenDto): Promise<AuthEntity> {
		const payload = await this.tokens.validate(validateTokenDto.token)

		const user = await this.users.findOne(payload.sub)

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
		const user = await this.users.create(createUserDto)

		const token = await this.tokens.create(user, '1h')

		const smtp = await this.mails.sendVerificationEmail(user, token)

		return smtp
	}

	async verifyEmail(validateTokenDto: ValidateTokenDto): Promise<UserEntity> {
		const payload = await this.tokens.validate(validateTokenDto.token)
		const userId = payload.sub

		const user = await this.users.update(userId, {
			emailVerified: new Date(),
		})

		return user
	}
}
