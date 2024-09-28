import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { VerificationTokenEntity } from '../entities'

@Injectable()
export class VerificationTokensService {
	constructor(private prisma: PrismaService) {}

	async create(identifier: string, token: string): Promise<string> {
		await this.prisma.verificationToken.create({
			data: {
				token,
				identifier,
				expires: new Date(Date.now() + 10 * 60 * 1000),
			},
		})

		return token
	}

	async findOne(
		token: string,
		identifier: string
	): Promise<VerificationTokenEntity> {
		const verificationToken = await this.prisma.verificationToken.findFirst({
			where: {
				token,
				identifier,
				expires: {
					gt: new Date(),
				},
			},
		})

		if (!verificationToken) {
			throw new UnauthorizedException('Token inválido o expirado')
		}

		return verificationToken
	}

	async deleteExpired(): Promise<void> {
		await this.prisma.verificationToken.deleteMany({
			where: {
				expires: {
					lte: new Date(),
				},
			},
		})
	}
}
