import { MailerService } from '@nestjs-modules/mailer'
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { capitalCase } from 'change-case'
import { plainToClass } from 'class-transformer'
import { SmtpEntity, UserEntity } from 'src/auth/entities'

@Injectable()
export class MailsService {
	app: string
	year: number
	frontend_url: string

	constructor(
		private readonly mailerService: MailerService,
		private configService: ConfigService
	) {
		this.app = 'Journeys'
		this.year = new Date().getFullYear()
		this.frontend_url = this.configService.get<string>('FRONTEND_URL')
	}

	async sendPasswordResetEmail(
		user: UserEntity,
		token: string
	): Promise<SmtpEntity> {
		try {
			const name =
				user.userType === 'PERSONAL'
					? capitalCase(
							`${user.personalProfile.firstName} ${user.personalProfile.lastName}`
						)
					: capitalCase(user.companyProfile.name)
			const type = capitalCase(user.userType)

			const year = new Date().getFullYear()

			const app = 'Journeys'

			const frontend_url = this.configService.get<string>('FRONTEND_URL')

			const url = `${frontend_url}/reset-password?token=${token}`

			const smtpResponse = await this.mailerService.sendMail({
				to: user.email,
				subject: 'Restablecer contraseña',
				template: 'reset-password',
				context: {
					url,
					name,
					type,
					app,
					year,
				},
			})

			return plainToClass(SmtpEntity, smtpResponse)
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error
			}
			throw new InternalServerErrorException('Error al enviar el correo')
		}
	}

	async sendVerificationEmail(
		user: UserEntity,
		token: string
	): Promise<SmtpEntity> {
		try {
			const type = capitalCase(user.userType)
			const url = `${this.frontend_url}/verify-email?token=${token}`

			const smtpResponse = await this.mailerService.sendMail({
				to: user.email,
				subject: 'Valida Tu Correo',
				template: 'verification-email',
				context: {
					url,
					type,
					app: this.app,
					year: this.year,
				},
			})

			return plainToClass(SmtpEntity, smtpResponse)
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error
			}
			throw new InternalServerErrorException('Error al enviar el correo')
		}
	}
}
