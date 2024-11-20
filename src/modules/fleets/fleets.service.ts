import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities/paginated-response.entity'
import { FilterRules, FilterTypes } from 'src/common/enums'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { PrismaService } from '../prisma/prisma.service'
import { VehicleQueryParamsDto } from '../vehicles/dto'
import { VehicleEntity } from '../vehicles/entities/vehicle.entity'
import { VehiclesService } from '../vehicles/vehicles.service'
import { FleetQueryParamsDto } from './dto'
import { CreateFleetDto } from './dto/create-fleet.dto'
import { UpdateFleetDto } from './dto/update-fleet.dto'
import { FleetEntity } from './entities/fleet.entity'

@Injectable()
export class FleetsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly vehicles: VehiclesService
	) {}

	async create(
		userId: string,
		createFleetDto: CreateFleetDto
	): Promise<FleetEntity> {
		const createdFleet = await this.prisma.fleet.create({
			data: {
				userId,
				...createFleetDto,
			},
		})

		return plainToInstance(FleetEntity, createdFleet)
	}

	async findAll(
		userId: string,
		queryParamsDto: FleetQueryParamsDto
	): Promise<PaginatedResponseEntity<FleetEntity>> {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.FleetFindManyArgs = {
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
			this.prisma.fleet.findMany(query),
			this.prisma.fleet.count({ where: query.where }),
		])

		const fleets = plainToInstance(FleetEntity, records)

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return plainToInstance(PaginatedResponseEntity, {
			data: fleets,
			meta: metadata,
		})
	}

	async findOne(userId: string, id: string): Promise<FleetEntity> {
		const foundFleet = await this.prisma.fleet.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundFleet) {
			throw new NotFoundException('Flota no encontrada')
		}

		return plainToInstance(FleetEntity, foundFleet)
	}

	async update(
		userId: string,
		id: string,
		updateFleetDto: UpdateFleetDto
	): Promise<FleetEntity> {
		const updatedFleet = await this.prisma.fleet.update({
			where: {
				userId,
				id,
			},
			data: {
				...updateFleetDto,
			},
		})

		return plainToInstance(FleetEntity, updatedFleet)
	}

	async remove(userId: string, id: string) {
		await this.prisma.fleet.delete({
			where: { id, userId },
		})

		return `Eliminación completa!`
	}

	async findVehicles(
		userId: string,
		id: string,
		queryParamsDto: VehicleQueryParamsDto
	): Promise<PaginatedResponseEntity<VehicleEntity>> {
		await this.findOne(userId, id)

		const newQueryParams: VehicleQueryParamsDto = {
			...queryParamsDto,
			filters: [
				{
					field: 'fleetId',
					rule: FilterRules.EQUALS,
					type: FilterTypes.STRING,
					value: id,
				},
				...queryParamsDto.filters,
			],
		}

		return await this.vehicles.findAll(userId, newQueryParams)
	}
}
