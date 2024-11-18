import { Module } from '@nestjs/common'
import { FleetsController } from './fleets.controller'
import { FleetsService } from './fleets.service'

@Module({
	controllers: [FleetsController],
	providers: [FleetsService],
})
export class FleetsModule {}
