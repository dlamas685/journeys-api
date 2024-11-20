import { Module } from '@nestjs/common'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { UsersModule } from '../users/users.module'
import { VehiclesModule } from '../vehicles/vehicles.module'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'

@Module({
	imports: [CloudinaryModule, UsersModule, VehiclesModule],
	controllers: [FilesController],
	providers: [FilesService],
})
export class FilesModule {}
