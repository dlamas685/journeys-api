import { Module } from '@nestjs/common'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { DriversModule } from '../drivers/drivers.module'
import { UsersModule } from '../users/users.module'
import { VehiclesModule } from '../vehicles/vehicles.module'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'

@Module({
	imports: [CloudinaryModule, UsersModule, VehiclesModule, DriversModule],
	controllers: [FilesController],
	providers: [FilesService],
	exports: [FilesService],
})
export class FilesModule {}
