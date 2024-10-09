import { Module } from '@nestjs/common';
import { FavoritePlacesService } from './favorite-places.service';
import { FavoritePlacesController } from './favorite-places.controller';

@Module({
  controllers: [FavoritePlacesController],
  providers: [FavoritePlacesService],
})
export class FavoritePlacesModule {}
