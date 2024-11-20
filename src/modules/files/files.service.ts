import { Injectable, NotFoundException } from '@nestjs/common'
import { existsSync } from 'fs'
import { join } from 'path'
import { getPublicIdFromUrl, isGoogleImage } from 'src/common/helpers'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { UsersService } from '../users/users.service'
import { VehiclesService } from '../vehicles/vehicles.service'

@Injectable()
export class FilesService {
	constructor(
		private readonly cloudinary: CloudinaryService,
		private readonly users: UsersService,
		private readonly vehicles: VehiclesService
	) {}

	getStaticImage(name: string, folder: string) {
		const path = join(process.cwd(), 'static', folder, name)

		if (!existsSync(path))
			throw new NotFoundException(`No se encontró la imagen: ${name}`)

		return path
	}

	async uploadUserImage(userId: string, file: Express.Multer.File) {
		const user = await this.users.findOne(userId)

		if (user.imageUrl && !isGoogleImage(user.imageUrl)) {
			const publicId = getPublicIdFromUrl(user.imageUrl)
			await this.cloudinary.deleteFile(publicId)
		}

		const cloud = await this.cloudinary.uploadFile(file)

		const updatedUser = await this.users.update(userId, {
			imageUrl: cloud.secure_url,
		})

		return updatedUser
	}

	async deleteUserImage(userId: string) {
		const user = await this.users.findOne(userId)

		if (user.imageUrl) {
			const publicId = getPublicIdFromUrl(user.imageUrl)

			await this.cloudinary.deleteFile(publicId)

			const updatedUser = await this.users.update(userId, { imageUrl: null })

			return updatedUser
		}

		return user
	}

	async uploadVehicleImage(
		userId: string,
		id: string,
		file: Express.Multer.File
	) {
		const vehicle = await this.vehicles.findOne(userId, id)

		if (vehicle.imageUrl && !isGoogleImage(vehicle.imageUrl)) {
			const publicId = getPublicIdFromUrl(vehicle.imageUrl)
			await this.cloudinary.deleteFile(publicId)
		}

		const cloud = await this.cloudinary.uploadFile(file)

		const updatedVehicle = await this.vehicles.update(userId, id, {
			imageUrl: cloud.secure_url,
		})

		return updatedVehicle
	}

	async deleteVehicleImage(userId: string, id: string) {
		const vehicle = await this.vehicles.findOne(userId, id)

		if (vehicle.imageUrl) {
			const publicId = getPublicIdFromUrl(vehicle.imageUrl)

			await this.cloudinary.deleteFile(publicId)

			const updatedVehicle = await this.vehicles.update(userId, id, {
				imageUrl: null,
			})

			return updatedVehicle
		}

		return vehicle
	}
}
