import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities'
import { FilterRules, FilterTypes } from 'src/common/enums'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { DriverQueryParamsDto } from '../drivers/dtos'
import { PrismaService } from '../prisma/prisma.service'
import { VehicleQueryParamsDto } from '../vehicles/dtos'
import { VehicleEntity } from '../vehicles/entities/vehicle.entity'
import { VehiclesService } from '../vehicles/vehicles.service'
import {
	FleetQueryParamsDto,
	RelateDriversToFleetDto,
	RelateVehiclesToFleetDto,
} from './dtos'
import { CreateFleetDto } from './dtos/create-fleet.dto'
import { UpdateFleetDto } from './dtos/update-fleet.dto'
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
			include: {
				vehicles: true,
				drivers: true,
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
			include: {
				vehicles: true,
				drivers: true,
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

	async findDrivers(
		userId: string,
		id: string,
		queryParamsDto: DriverQueryParamsDto
	): Promise<PaginatedResponseEntity<VehicleEntity>> {
		await this.findOne(userId, id)

		const newQueryParams: DriverQueryParamsDto = {
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

	async linkVehiclesToFleet(
		userId: string,
		id: string,
		relateVehiclesToFleetDto: RelateVehiclesToFleetDto
	): Promise<FleetEntity> {
		const fleet = await this.findOne(userId, id)

		if (
			relateVehiclesToFleetDto.vehicleIds.length >
			fleet.maxVehicles - fleet.vehicles.length
		) {
			throw new BadRequestException('No se pueden agregar más vehículos')
		}

		const updatedFleet = await this.prisma.fleet.update({
			where: {
				userId,
				id,
			},
			data: {
				vehicles: {
					connect: relateVehiclesToFleetDto.vehicleIds.map(vehicleId => ({
						id: vehicleId,
					})),
				},
			},
		})

		return plainToInstance(FleetEntity, updatedFleet)
	}

	async unlinkVehiclesFromFleet(
		userId: string,
		id: string,
		relateVehiclesToFleetDto: RelateVehiclesToFleetDto
	): Promise<FleetEntity> {
		await this.findOne(userId, id)

		const updatedFleet = await this.prisma.fleet.update({
			where: {
				userId,
				id,
			},
			data: {
				vehicles: {
					disconnect: relateVehiclesToFleetDto.vehicleIds.map(vehicleId => ({
						id: vehicleId,
					})),
				},
			},
		})

		return plainToInstance(FleetEntity, updatedFleet)
	}

	async linkDriversToFleet(
		userId: string,
		id: string,
		relateDriversToFleetDto: RelateDriversToFleetDto
	): Promise<FleetEntity> {
		const driver = await this.findOne(userId, id)

		if (
			relateDriversToFleetDto.driverIds.length >
			driver.maxDrivers - driver.drivers.length
		) {
			throw new BadRequestException('No se pueden agregar más conductores')
		}

		const updatedFleet = await this.prisma.fleet.update({
			where: {
				userId,
				id,
			},
			data: {
				drivers: {
					connect: relateDriversToFleetDto.driverIds.map(driverId => ({
						id: driverId,
					})),
				},
			},
		})

		return plainToInstance(FleetEntity, updatedFleet)
	}

	async unlinkDriversFromFleet(
		userId: string,
		id: string,
		relateDriversToFleetDto: RelateDriversToFleetDto
	): Promise<FleetEntity> {
		await this.findOne(userId, id)

		const updatedFleet = await this.prisma.fleet.update({
			where: {
				userId,
				id,
			},
			data: {
				drivers: {
					disconnect: relateDriversToFleetDto.driverIds.map(driverId => ({
						id: driverId,
					})),
				},
			},
		})

		return plainToInstance(FleetEntity, updatedFleet)
	}
}
