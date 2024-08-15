import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/common/services/prisma.service'
import { CreateUserDto } from '../dto/create-user.dto'
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
