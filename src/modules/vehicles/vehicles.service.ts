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
import { VehicleQueryParamsDto } from './dto'
import { CreateVehicleDto } from './dto/create-vehicle.dto'
import { UpdateVehicleDto } from './dto/update-vehicle.dto'
import { VehicleEntity } from './entities/vehicle.entity'

@Injectable()
export class VehiclesService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cloudinary: CloudinaryService
	) {}

	async create(
		userId: string,
		createVehicleDto: CreateVehicleDto
	): Promise<VehicleEntity> {
		const newVehicle = await this.prisma.vehicle.create({
			data: {
				userId,
				...createVehicleDto,
			},
		})

		return plainToInstance(VehicleEntity, newVehicle)
	}

	async findAll(
		userId: string,
		queryParamsDto: VehicleQueryParamsDto
	): Promise<PaginatedResponseEntity<VehicleEntity>> {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.VehicleFindManyArgs = {
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
			this.prisma.vehicle.findMany(query),
			this.prisma.vehicle.count({ where: query.where }),
		])

		const vehicles = plainToInstance(VehicleEntity, records)

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return plainToInstance(PaginatedResponseEntity, {
			data: vehicles,
			meta: metadata,
		})
	}

	async findOne(userId: string, id: string): Promise<VehicleEntity> {
		const foundVehicle = await this.prisma.vehicle.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundVehicle) {
			throw new NotFoundException('Vehículo no encontrado')
		}

		return plainToInstance(VehicleEntity, foundVehicle)
	}

	async update(
		userId: string,
		id: string,
		updateVehicleDto: UpdateVehicleDto
	): Promise<VehicleEntity> {
		const updatedVehicle = await this.prisma.vehicle.update({
			where: {
				userId,
				id,
			},
			data: {
				...updateVehicleDto,
			},
		})

		return plainToInstance(VehicleEntity, updatedVehicle)
	}

	async remove(userId: string, id: string) {
		await this.prisma.$transaction(async prisma => {
			const deletedVehicle = await prisma.vehicle.delete({
				where: {
					userId,
					id,
				},
			})

			try {
				if (deletedVehicle.imageUrl) {
					const publicId = getPublicIdFromUrl(deletedVehicle.imageUrl)

					await this.cloudinary.deleteFile(publicId)
				}
			} catch (error) {
				throw new InternalServerErrorException(
					`Error al eliminar la imagen del vehículo: ${error.message}`
				)
			}
		})

		return `Eliminación completa!`
	}
}
