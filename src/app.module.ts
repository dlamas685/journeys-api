import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './common/services/prisma.service'
import { envConfig } from './config'

@Module({
	imports: [
		ConfigModule.forRoot(envConfig),
		ScheduleModule.forRoot(),
		AuthModule,
	],
	controllers: [],
	providers: [PrismaService],
})
export class AppModule {}
