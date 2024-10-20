import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { CreateAccountDto } from '../dto'

@Injectable()
export class AccountsService {
	constructor(private prisma: PrismaService) {}

	async create(createAccountDto: CreateAccountDto) {
		const account = this.prisma.account.create({
			data: createAccountDto,
		})
		return account
	}

	async findOne(providerAccountId: string, provider: string) {
		const account = this.prisma.account.findFirst({
			where: {
				provider,
				providerAccountId,
			},
			include: {
				user: {
					include: {
						companyProfile: true,
						personalProfile: true,
					},
				},
			},
		})
		return account
	}
}
