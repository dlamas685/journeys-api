import { CacheModule, CacheStore } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { redisStore } from 'cache-manager-redis-store'
import { join } from 'path'
import { envConfig } from './config'
import { ActivityTemplatesModule } from './modules/activity-templates/activity-templates.module'
import { AuthModule } from './modules/auth/auth.module'
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module'
import { FavoriteAddressesModule } from './modules/favorite-addresses/favorite-addresses.module'
import { FavoritePlacesModule } from './modules/favorite-places/favorite-places.module'
import { FilesModule } from './modules/files/files.module'
import { GoogleMapsModule } from './modules/google-maps/google-maps.module'
import { EmailsModule } from './modules/mails/emails.module'
import { OptionsModule } from './modules/options/options.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { UsersModule } from './modules/users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot(envConfig),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public'),
		}),
		CacheModule.registerAsync({
			isGlobal: true,
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => {
				const store = await redisStore({
					url: config.get('REDIS_URL'),
					ttl: Number(config.get('CACHE_TTL')),
				})

				return {
					store: store as unknown as CacheStore,
				}
			},
		}),
		ScheduleModule.forRoot(),
		PrismaModule,
		EmailsModule,
		AuthModule,
		UsersModule,
		FavoriteAddressesModule,
		CloudinaryModule,
		FilesModule,
		OptionsModule,
		FavoritePlacesModule,
		ActivityTemplatesModule,
		GoogleMapsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
