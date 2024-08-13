import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma.service'

@Injectable()
export class UsersService {
	constructor(private prismaService: PrismaService) {}

	async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}
}
