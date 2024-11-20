import { Module } from '@nestjs/common'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { DriversController } from './drivers.controller'
import { DriversService } from './drivers.service'

@Module({
	controllers: [DriversController],
	providers: [DriversService],
	imports: [CloudinaryModule],
})
export class DriversModule {}
