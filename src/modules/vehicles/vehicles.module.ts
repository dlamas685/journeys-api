import { Module } from '@nestjs/common'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { VehiclesController } from './vehicles.controller'
import { VehiclesService } from './vehicles.service'

@Module({
	imports: [CloudinaryModule],
	controllers: [VehiclesController],
	providers: [VehiclesService],
	exports: [VehiclesService],
})
export class VehiclesModule {}
