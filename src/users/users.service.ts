import { Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../common/modules/prisma/prisma.service'
import {
	CreateAccountDto,
	CreateUserDto,
	UpdateUserDto,
	UpdateUserWithProfileDto,
} from './dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersService {
	// TODO: move salt into env variables
	private readonly salt: number = 10

	constructor(private readonly prisma: PrismaService) {}

	async create(createUserDto: CreateUserDto): Promise<UserEntity> {
		const { password, ...restDto } = createUserDto

		const hashedPassword = password && (await bcrypt.hash(password, this.salt))

		const newUser = await this.prisma.user.create({
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

	async findAll() {
		return await this.prisma.user.findMany()
	}

	async findOne(id: string) {
		const user = await this.prisma.user.findUnique({
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
		const user = await this.prisma.user.findUnique({
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

	async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
		const { password, ...data } = updateUserDto

		const newPassword = password
			? await bcrypt.hash(password, this.salt)
			: undefined

		const user = await this.prisma.user.update({
			where: {
				id,
			},
			data: {
				...data,
				password: newPassword,
			},
			include: {
				companyProfile: true,
				personalProfile: true,
			},
		})

		return new UserEntity(user)
	}

	async updateWithProfile(
		id: string,
		updateUserDto: UpdateUserWithProfileDto
	): Promise<UserEntity> {
		const { companyProfile, personalProfile, ...user } = updateUserDto

		const updatedUser = await this.prisma.user.update({
			data: {
				...user,
				companyProfile: {
					update: companyProfile,
				},
				personalProfile: {
					update: personalProfile,
				},
			},
			where: {
				id,
			},
			include: {
				companyProfile: true,
				personalProfile: true,
			},
		})

		return new UserEntity(updatedUser)
	}

	async remove(id: string) {
		const removedUser = await this.prisma.user.delete({
			where: { id },
		})

		return `User ${removedUser.id} was removed`
	}

	async createUserAccount(
		createUserDto: CreateUserDto,
		account: CreateAccountDto
	): Promise<UserEntity> {
		const user = await this.prisma.user.create({
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
