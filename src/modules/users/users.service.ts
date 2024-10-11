import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { QueryParamsDto } from 'src/common/dto'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAccountDto, CreateUserDto, UpdateUserDto } from './dto'
import { CompanyProfileEntity } from './entities/company-profile.entity'
import { PersonalProfileEntity } from './entities/personal-profile.entity'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersService {
	private readonly salts: number

	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService
	) {
		this.salts = this.config.get<number>('SALTS')
	}

	async create(createUserDto: CreateUserDto): Promise<UserEntity> {
		const { password, companyProfile, personalProfile, ...data } = createUserDto

		const hashedPassword = password && (await bcrypt.hash(password, this.salts))

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

	async findAll(queryParamsDto: QueryParamsDto) {
		const { page, limit, filters, sorts, logicalFilters } = queryParamsDto

		const parseFilters = filters ? fromFiltersToWhere(filters) : {}

		const parseLogical = logicalFilters
			? fromLogicalFiltersToWhere(logicalFilters)
			: {}

		const parseSorts = sorts ? fromSortsToOrderby(sorts) : {}

		return await this.prisma.user.findMany({
			where: {
				...parseFilters,
				...parseLogical,
			},
			orderBy: {
				...parseSorts,
			},
			skip: (page - 1) * limit,
			take: limit,
		})
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
			? await bcrypt.hash(password, this.salts)
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
}
