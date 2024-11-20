import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities/paginated-response.entity'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
	getPublicIdFromUrl,
} from 'src/common/helpers'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { PrismaService } from '../prisma/prisma.service'
import { CreateDriverDto } from './dto/create-driver.dto'
import { DriverQueryParamsDto } from './dto/driver-params.dto'
import { UpdateDriverDto } from './dto/update-driver.dto'
import { DriverEntity } from './entities/driver.entity'

@Injectable()
export class DriversService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cloudinary: CloudinaryService
	) {}

	async create(
		userId: string,
		createDriverDto: CreateDriverDto
	): Promise<DriverEntity> {
		const newDriver = await this.prisma.driver.create({
			data: {
				userId,
				...createDriverDto,
			},
		})

		return plainToInstance(DriverEntity, newDriver)
	}

	async findAll(
		userId: string,
		queryParamsDto: DriverQueryParamsDto
	): Promise<PaginatedResponseEntity<DriverEntity>> {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.DriverFindManyArgs = {
			where: {
				userId,
				...parsedFilters,
				...parsedLogicalFilters,
			},
			orderBy: {
				...parsedSorts,
			},
			skip:
				queryParamsDto.page && queryParamsDto.limit
					? (queryParamsDto.page - 1) * queryParamsDto.limit
					: undefined,
			take: queryParamsDto.limit,
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.driver.findMany(query),
			this.prisma.driver.count({ where: query.where }),
		])

		const drivers = plainToInstance(DriverEntity, records)

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return plainToInstance(PaginatedResponseEntity, {
			data: drivers,
			meta: metadata,
		})
	}

	async findOne(userId: string, id: string): Promise<DriverEntity> {
		const foundDriver = await this.prisma.driver.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundDriver) {
			throw new NotFoundException('Conductor no encontrado')
		}

		return plainToInstance(DriverEntity, foundDriver)
	}

	async update(
		userId: string,
		id: string,
		updateDriverDto: UpdateDriverDto
	): Promise<DriverEntity> {
		const updatedDriver = await this.prisma.driver.update({
			where: {
				userId,
				id,
			},
			data: {
				...updateDriverDto,
			},
		})

		return plainToInstance(DriverEntity, updatedDriver)
	}

	async remove(userId: string, id: string) {
		await this.prisma.$transaction(async prisma => {
			const deletedDriver = await prisma.driver.delete({
				where: {
					userId,
					id,
				},
			})

			try {
				if (deletedDriver.imageUrl) {
					const publicId = getPublicIdFromUrl(deletedDriver.imageUrl)

					await this.cloudinary.deleteFile(publicId)
				}
			} catch (error) {
				throw new InternalServerErrorException(
					`Error al eliminar la imagen del conductor: ${error.message}`
				)
			}
		})

		return `Eliminación completa!`
	}
}
