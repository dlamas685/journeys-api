import { Module } from '@nestjs/common'
import { GoogleMapsModule } from '../google-maps/google-maps.module'
import { FavoriteAddressesController } from './favorite-addresses.controller'
import { FavoriteAddressesService } from './favorite-addresses.service'

@Module({
	controllers: [FavoriteAddressesController],
	providers: [FavoriteAddressesService],
	imports: [GoogleMapsModule],
})
export class FavoriteAddressesModule {}
