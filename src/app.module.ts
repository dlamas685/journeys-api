import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AuthModule } from './auth/auth.module'
import { EmailsModule } from './common/modules/mails/emails.module'
import { PrismaModule } from './common/modules/prisma/prisma.module'
import { envConfig } from './config'
import { FavoriteAddressesModule } from './favorite-addresses/favorite-addresses.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot(envConfig),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'emails/static'),
			serveRoot: '/static',
		}),
		ScheduleModule.forRoot(),
		PrismaModule,
		EmailsModule,
		AuthModule,
		UsersModule,
		FavoriteAddressesModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
