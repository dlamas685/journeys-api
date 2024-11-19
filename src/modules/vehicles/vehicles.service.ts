import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../prisma/prisma.service'
import { CreateVehicleDto } from './dto/create-vehicle.dto'
import { UpdateVehicleDto } from './dto/update-vehicle.dto'
import { VehicleEntity } from './entities/vehicle.entity'

@Injectable()
export class VehiclesService {
	constructor(private readonly prisma: PrismaService) {}

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

	async findAll(userId: string, fleetId?: string): Promise<VehicleEntity[]> {
		const findVehicles = await this.prisma.vehicle.findMany({
			where: {
				userId,
				fleetId,
			},
		})
		return plainToInstance(VehicleEntity, findVehicles)
	}

	async findOne(userId: string, id: string): Promise<VehicleEntity> {
		const foundVehicle = await this.prisma.vehicle.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundVehicle) {
			throw new Error('Fleet not found')
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
		await this.prisma.vehicle.delete({
			where: { id, userId },
		})

		return `Eliminación completa!`
	}
}
