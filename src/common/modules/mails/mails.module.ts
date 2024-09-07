import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailsService } from './mails.service'

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
	providers: [MailsService],
	exports: [MailsService],
})
export class MailsModule {}
