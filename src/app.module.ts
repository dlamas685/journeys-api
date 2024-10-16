import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { envConfig } from './config'
import { AuthModule } from './modules/auth/auth.module'
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module'
import { FavoriteAddressesModule } from './modules/favorite-addresses/favorite-addresses.module'
import { FavoritePlacesModule } from './modules/favorite-places/favorite-places.module'
import { FilesModule } from './modules/files/files.module'
import { EmailsModule } from './modules/mails/emails.module'
import { OptionsModule } from './modules/options/options.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { UsersModule } from './modules/users/users.module'
import { ActivityTemplatesModule } from './modules/activity-templates/activity-templates.module';

@Module({
	imports: [
		ConfigModule.forRoot(envConfig),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public'),
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
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
