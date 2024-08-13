import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { PrismaService } from 'src/common/services/prisma.service'
import { TokenPayload } from '../models/token-payload.model'

@Injectable()
export class SessionService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService
	) {}

	async create(user: User, rememberMe: boolean) {
		const payload: TokenPayload = { email: user.email, sub: user.id }

		const token = this.jwtService.sign(payload, {
			expiresIn: rememberMe ? '30d' : '1d',
		})

		const expires = this.jwtService.decode(token)?.exp

		const session = await this.prisma.session.create({
			data: {
				userId: user.id,
				sessionToken: token,
				expires: new Date(expires * 1000),
			},
			include: {
				user: {
					select: {
						id: true,
						email: true,
						imageUrl: true,
					},
					include: {
						companyProfile: true,
						personalProfile: true,
					},
				},
			},
		})

		return session
	}

	async validate(sessionToken: string) {
		try {
			this.jwtService.verify(sessionToken)
			const session = await this.prisma.session.findUnique({
				where: { sessionToken },
				include: {
					user: {
						select: {
							id: true,
							email: true,
						},
						include: {
							companyProfile: true,
							personalProfile: true,
						},
					},
				},
			})

			if (!session || session.expires < new Date()) {
				throw new UnauthorizedException('Invalid session token')
			}

			return session
		} catch (error) {
			throw new UnauthorizedException('Invalid session token')
		}
	}

	async remove(sessionToken: string) {
		return this.prisma.session.delete({
			where: { sessionToken },
		})
	}

	async removeExpired() {
		return this.prisma.session.deleteMany({
			where: {
				expires: {
					lt: new Date(),
				},
			},
		})
	}
}
