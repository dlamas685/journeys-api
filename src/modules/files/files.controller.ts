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
import { UserEntity } from '../users/entities'
import { VehicleEntity } from '../vehicles/entities/vehicle.entity'
import { FilesService } from './files.service'
import { imageFilter } from './helpers/image-filter.helper'

@ApiTags('Files')
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
	constructor(private readonly files: FilesService) {}

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
		return this.files.uploadUserImage(userId, file)
	}

	@Delete('profile')
	@ApiOperation({
		summary: 'Eliminación de imagen (perfil)',
		description: 'Elimina la imagen actual del perfil del usuario autenticado',
	})
	@ApiBearerAuth('JWT-auth')
	@ApiOkResponse({ type: UserEntity })
	async deleteUserImage(@UserId() userId) {
		return this.files.deleteUserImage(userId)
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
	async uploadVehicleImage(
		@UserId() userId,
		@Param('id', ParseUUIDPipe) id: string,
		@UploadedFile() file: Express.Multer.File
	) {
		return this.files.uploadVehicleImage(userId, id, file)
	}

	@Delete('vehicles/:id')
	@ApiOperation({
		summary: 'Eliminación de imagen (vehículos)',
		description: 'Elimina la imagen actual de un vehículo.',
	})
	@ApiBearerAuth('JWT-auth')
	@ApiOkResponse({ type: VehicleEntity })
	async deleteVehicleImage(
		@UserId() userId,
		@Param('id', ParseUUIDPipe) id: string
	) {
		return this.files.deleteVehicleImage(userId, id)
	}
}
