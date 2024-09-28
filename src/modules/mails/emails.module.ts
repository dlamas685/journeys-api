import { MailerModule } from '@nestjs-modules/mailer'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EmailsService } from './mails.service'

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				transport: {
					host: config.get('MAIL_HOST'),
					port: config.get('MAIL_PORT'),
					secure: false,
					auth: {
						user: config.get('MAIL_USER'),
						pass: config.get('MAIL_PASSWORD'),
					},
				},
				defaults: {
					from: {
						name: 'Journeys',
						address: config.get('MAIL_FROM'),
					},
				},
			}),
		}),
	],
	providers: [EmailsService],
	exports: [EmailsService],
})
export class EmailsModule {}
