import { Injectable, NotFoundException } from '@nestjs/common'
import { existsSync } from 'fs'
import { join } from 'path'

@Injectable()
export class FilesService {
	getStaticImage(name: string, folder: string) {
		const path = join(process.cwd(), 'static', folder, name)

		if (!existsSync(path))
			throw new NotFoundException(`No se encontró la imagen: ${name}`)

		return path
	}
}
