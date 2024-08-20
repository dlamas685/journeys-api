import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/common/services/prisma.service'
import { CreateAccountDto, CreateUserDto, UpdateUserDto } from '../dto'
import { UserEntity } from '../entities'

@Injectable()
export class UsersService {
	private readonly salt: number = 10

	constructor(private prismaService: PrismaService) {}

	async create(createUserDto: CreateUserDto): Promise<UserEntity> {
		const { password, ...restDto } = createUserDto

		const newPassword = password
			? await bcrypt.hash(password, this.salt)
			: undefined

		const newUser = await this.prismaService.user.create({
			data: {
				...restDto,
				password: newPassword,
			},
			include: {
				companyProfile: true,
				personalProfile: true,
				accounts: true,
			},
		})

		return new UserEntity(newUser)
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
		const { password, ...restDto } = updateUserDto

		const newPassword = password
			? await bcrypt.hash(password, this.salt)
			: undefined

		const user = await this.prismaService.user.update({
			where: {
				id,
			},
			data: {
				...restDto,
				password: newPassword,
			},
			include: {
				companyProfile: true,
				personalProfile: true,
			},
		})

		return new UserEntity(user)
	}

	async findOne(id: string): Promise<UserEntity> {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
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

		return user
	}

	async createUserAccount(
		createUserDto: CreateUserDto,
		account: CreateAccountDto
	): Promise<UserEntity> {
		const user = await this.prismaService.user.create({
			data: {
				...createUserDto,
				accounts: {
					create: account,
				},
			},
			include: {
				companyProfile: true,
				personalProfile: true,
				accounts: true,
			},
		})

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
