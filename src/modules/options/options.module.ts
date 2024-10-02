import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { OptionsController } from './options.controller'
import { OptionsService } from './options.service';

@Module({
	imports: [UsersModule],
	controllers: [OptionsController],
	providers: [OptionsService],
})
export class OptionsModule {}
