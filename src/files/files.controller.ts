import { Controller, Get, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { FilesService } from './files.service'

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get(':folder/:name')
	findImage(
		@Res() res: Response,
		@Param('name') name: string,
		@Param('folder') folder: string
	) {
		const path = this.filesService.getStaticImage(name, folder)
		res.sendFile(path)
	}
}
