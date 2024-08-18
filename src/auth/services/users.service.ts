import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma.service'
import { UpdateUserDto } from '../dto'
import { UserEntity } from '../entities'

@Injectable()
export class UsersService {
	constructor(private prismaService: PrismaService) {}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
		const user = await this.prismaService.user.update({
			where: {
				id,
			},
			data: updateUserDto,
			include: {
				companyProfile: true,
				personalProfile: true,
			},
		})

		return new UserEntity(user)
	}

	async findByEmail(email: string): Promise<UserEntity> {
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
			throw new NotFoundException('Usuario no encontrado')
		}

		return user
	}
}
