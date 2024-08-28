import { Injectable, NotFoundException } from '@nestjs/common'
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

		const hashedPassword = password && (await bcrypt.hash(password, this.salt))

		const newUser = await this.prismaService.user.create({
			data: {
				...restDto,
				password: hashedPassword,
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

		if (!user) {
			throw new NotFoundException('Usuario no encontrado')
		}

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
}
