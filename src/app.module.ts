import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from './auth/auth.module'
import { EmailsModule } from './common/modules/mails/emails.module'
import { PrismaModule } from './common/modules/prisma/prisma.module'
import { envConfig } from './config'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot(envConfig),
		ScheduleModule.forRoot(),
		PrismaModule,
		EmailsModule,
		AuthModule,
		UsersModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
