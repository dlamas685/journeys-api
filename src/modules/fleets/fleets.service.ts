import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../prisma/prisma.service'
import { CreateFleetDto } from './dto/create-fleet.dto'
import { UpdateFleetDto } from './dto/update-fleet.dto'
import { FleetEntity } from './entities/fleet.entity'

@Injectable()
export class FleetsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		userId: string,
		createFleetDto: CreateFleetDto
	): Promise<FleetEntity> {
		const newFleet = await this.prisma.fleet.create({
			data: {
				userId,
				...createFleetDto,
			},
		})

		return new FleetEntity(newFleet)
	}

	async findAll(userId: string): Promise<FleetEntity[]> {
		const findFleets = await this.prisma.fleet.findMany({ where: { userId } })
		return plainToInstance(FleetEntity, findFleets)
	}

	async findOne(userId: string, id: string): Promise<FleetEntity> {
		const foundFleet = await this.prisma.fleet.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundFleet) {
			throw new Error('Fleet not found')
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
}
