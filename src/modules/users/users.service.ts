import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { plainToClass } from 'class-transformer'
import { QueryParamsDto } from 'src/common/dto'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities/paginated-response.entity'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { CreateAccountDto } from '../auth/dto'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto, UpdateUserDto } from './dto'
import {
	CompanyProfileEntity,
	PersonalProfileEntity,
	UserEntity,
} from './entities'

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
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.UserFindManyArgs = {
			skip: (queryParamsDto.page - 1) * queryParamsDto.limit,
			take: queryParamsDto.limit,
			where: {
				...parsedFilters,
				...parsedLogicalFilters,
			},
			orderBy: {
				...parsedSorts,
			},
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.user.findMany(query),
			this.prisma.user.count({ where: query.where }),
		])

		const users = records.map(record => new UserEntity(record))

		const metadata = plainToClass(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return new PaginatedResponseEntity<UserEntity>(users, metadata)
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
