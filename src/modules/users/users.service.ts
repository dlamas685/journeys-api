import { Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import {
	ChangePasswordDto,
	CreateAccountDto,
	CreateUserDto,
	UpdateUserDto,
} from './dto'
import { CompanyProfileEntity } from './entities/company-profile.entity'
import { PersonalProfileEntity } from './entities/personal-profile.entity'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersService {
	// TODO: move salt into env variables
	private readonly salt: number = 10

	constructor(private readonly prisma: PrismaService) {}

	async create(createUserDto: CreateUserDto): Promise<UserEntity> {
		const { password, companyProfile, personalProfile, ...data } = createUserDto

		const hashedPassword = password && (await bcrypt.hash(password, this.salt))

		const newUser = await this.prisma.user.create({
			data: {
				...data,
				password: hashedPassword,
				companyProfile: {
					create: companyProfile,
				},
				personalProfile: {
					create: personalProfile,
				},
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
		const { password, companyProfile, personalProfile, ...data } = updateUserDto

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
				companyProfile: {
					update: companyProfile,
				},
				personalProfile: {
					update: personalProfile,
				},
			},
			include: {
				companyProfile: true,
				personalProfile: true,
			},
		})

		return new UserEntity(user)
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
				personalProfile: {
					create: {} as PersonalProfileEntity,
				},
				companyProfile: {
					create: {} as CompanyProfileEntity,
				},
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

	async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
		const { password, newPassword } = changePasswordDto

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) {
			throw new NotFoundException('Usuario no encontrado')
		}

		const isValidPassword = await bcrypt.compare(password, user.password)

		if (!isValidPassword) {
			throw new NotFoundException('Contraseña incorrecta')
		}

		const hashedPassword = await bcrypt.hash(newPassword, this.salt)

		const updatedUser = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				password: hashedPassword,
			},
		})

		return new UserEntity(updatedUser)
	}
}
