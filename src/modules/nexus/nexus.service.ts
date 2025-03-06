import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AvailableRoadmapAssetQueryParamsDto } from './dtos/available-roadmap-asset-query'

@Injectable()
export class NexusService {
	constructor(private readonly prisma: PrismaService) {}

	async availableRoadmapAssets(
		userId: string,
		dateRange: AvailableRoadmapAssetQueryParamsDto
	) {
		const assignedAssets = await this.prisma.roadmap.findMany({
			distinct: ['driverId', 'vehicleId'],
			select: { vehicleId: true, driverId: true },
			where: {
				userId,
				OR: [
					{
						startDateTime: {
							gte: dateRange.fromDate,
							lte: dateRange.toDate,
						},
					},
					{
						endDateTime: {
							gte: dateRange.fromDate,
							lte: dateRange.toDate,
						},
					},
				],
			},
		})

		const { assignedVehicleIds, assignedDriverIds } = assignedAssets.reduce(
			(acc, { vehicleId, driverId }) => {
				acc.assignedVehicleIds.push(vehicleId)
				acc.assignedDriverIds.push(driverId)
				return acc
			},
			{ assignedVehicleIds: [] as string[], assignedDriverIds: [] as string[] }
		)

		const availableAssets = await this.prisma.fleet.findMany({
			select: {
				id: true,
				name: true,
				drivers: {
					select: { id: true, name: true },
					where: { id: { notIn: assignedDriverIds } },
				},
				vehicles: {
					select: { id: true, model: true, year: true, licensePlate: true },
					where: { id: { notIn: assignedVehicleIds } },
				},
			},
			where: {
				userId,
				vehicles: {
					some: {
						id: { notIn: assignedVehicleIds },
					},
				},
				drivers: {
					some: {
						id: { notIn: assignedDriverIds },
					},
				},
			},
		})

		return availableAssets
	}
}
