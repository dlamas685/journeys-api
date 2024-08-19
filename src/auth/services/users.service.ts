import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
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

	async createUser(input: CreateUserDto) {
		try {
			const user: Prisma.UserCreateInput = {
				email: input.email,
				password: input.password,
				userType: input.userType,
			}

			const createUser = await this.prismaService.user.create({
				data: user,
			})
			return createUser
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new BadRequestException(
						'There is a unique constraint violation, a new user cannot be created with this email'
					)
				}
			}
			throw error
		}
	}
}
