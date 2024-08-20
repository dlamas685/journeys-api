import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma.service'
import { CreateAccountDto } from '../dto/create-account.dto'

@Injectable()
export class AccountsService {
	constructor(private prismaService: PrismaService) {}

	async create(createAccountDto: CreateAccountDto) {
		const account = this.prismaService.account.create({
			data: createAccountDto,
		})
		return account
	}

	async findOne(providerAccountId: string, provider: string) {
		const account = this.prismaService.account.findFirst({
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
