import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Post,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import { Response } from 'express'
import { Public, UserId } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { UserEntity } from '../users/entities'
import { UsersService } from '../users/users.service'
import { VehicleEntity } from '../vehicles/entities/vehicle.entity'
import { VehiclesService } from '../vehicles/vehicles.service'
import { FilesService } from './files.service'
import { imageFilter } from './helpers/image-filter.helper'

@ApiTags('Files')
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
	constructor(
		private readonly files: FilesService,
		private readonly cloudinary: CloudinaryService,
		private readonly users: UsersService,
		private readonly vehicles: VehiclesService
	) {}

	@Public()
	@Get(':folder/:name')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Consulta de imagen estática',
		description: 'Permite obtener una imagen estática',
	})
	@ApiOkResponse({
		content: {
			'application/octet-stream': {
				schema: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	findImage(
		@Res() res: Response,
		@Param('name') name: string,
		@Param('folder') folder: string
	) {
		const path = this.files.getStaticImage(name, folder)
		res.sendFile(path)
	}

	@Post('profile')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: imageFilter,
		})
	)
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Carga de imagen (perfil)',
		description: 'Permite cargar una imagen al perfil del usuario autenticado',
	})
	@ApiBearerAuth('JWT-auth')
	@ApiOkResponse({ type: UserEntity })
	async uploadUserImage(
		@UserId() userId,
		@UploadedFile() file: Express.Multer.File
	) {
		const user = await this.users.findOne(userId)

		if (user.imageUrl && !this.isGoogleImage(user.imageUrl)) {
			const publicId = this.getPublicIdFromUrl(user.imageUrl)
			await this.cloudinary.deleteFile(publicId)
		}

		const cloud = await this.cloudinary.uploadFile(file)

		const updatedUser = await this.users.update(userId, {
			imageUrl: cloud.secure_url,
		})

		return updatedUser
	}

	@Delete('profile')
	@ApiOperation({
		summary: 'Eliminación de imagen (perfil)',
		description: 'Elimina la imagen actual del perfil del usuario autenticado',
	})
	@ApiBearerAuth('JWT-auth')
	@ApiOkResponse({ type: UserEntity })
	async deleteUserImage(@UserId() userId) {
		const user = await this.users.findOne(userId)

		if (user.imageUrl) {
			const publicId = this.getPublicIdFromUrl(user.imageUrl)
			await this.cloudinary.deleteFile(publicId)

			const updatedUser = await this.users.update(userId, { imageUrl: null })

			return updatedUser
		}

		return user
	}

	@Post('vehicles/:id')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: imageFilter,
		})
	)
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Carga de imagen (vehículos)',
		description: 'Permite cargar imagen a un vehículo.',
	})
	@ApiBearerAuth('JWT-auth')
	@ApiOkResponse({ type: VehicleEntity })
	async uploadVehiclesImage(
		@UserId() userId,
		@Param('id', ParseUUIDPipe) id: string,
		@UploadedFile() file: Express.Multer.File
	) {
		const vehicle = await this.vehicles.findOne(userId, id)

		if (vehicle.imageUrl && !this.isGoogleImage(vehicle.imageUrl)) {
			const publicId = this.getPublicIdFromUrl(vehicle.imageUrl)
			await this.cloudinary.deleteFile(publicId)
		}

		const cloud = await this.cloudinary.uploadFile(file)

		const updatedVehicle = await this.vehicles.update(userId, id, {
			imageUrl: cloud.secure_url,
		})

		return updatedVehicle
	}

	private getPublicIdFromUrl(url: string): string {
		const parts = url.split('/')
		const lastPart = parts[parts.length - 1]
		return lastPart.split('.')[0]
	}

	private isGoogleImage(imageUrl: string): boolean {
		return imageUrl.includes('googleusercontent.com')
	}
}
