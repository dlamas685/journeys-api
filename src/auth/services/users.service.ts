import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma.service'
import { UserWithProfiles } from '../models/users.model'

@Injectable()
export class UsersService {
	constructor(private prismaService: PrismaService) {}

	async findByEmail(email: string): Promise<UserWithProfiles> {
		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
			include: {
				companyProfile: true,
				personalProfile: true,
			},
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}
}
