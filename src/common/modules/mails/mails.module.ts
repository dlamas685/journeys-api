import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
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
				template: {
					dir: join(__dirname, 'templates'),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
		}),
	],
	providers: [MailsService],
	exports: [MailsService],
})
export class MailsModule {}
