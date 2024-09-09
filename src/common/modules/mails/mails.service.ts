import { MailerService } from '@nestjs-modules/mailer'
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import { capitalCase } from 'change-case'
import { plainToClass } from 'class-transformer'
import PasswordReset from 'emails/password-reset'
import WelcomeUser from 'emails/welcome-user'
import { SmtpEntity, UserEntity } from 'src/auth/entities'
import {
	COMPANY_USER_MESSAGE,
	COMPANY_USER_STEPS,
	PERSONAL_USER_MESSAGE,
	PERSONAL_USER_STEPS,
} from './constants'

@Injectable()
export class EmailsService {
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

			const frontend_url = this.configService.get<string>('FRONTEND_URL')

			const link = `${frontend_url}/password-resets?token=${token}&email=${user.email}`

			const html = await render(
				PasswordReset({
					name,
					link,
				})
			)

			const smtpResponse = await this.mailerService.sendMail({
				to: user.email,
				subject: 'Restablecer contraseña',
				html,
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
			const name = capitalCase(
				user.userType === 'PERSONAL'
					? `${user.personalProfile.firstName} ${user.personalProfile.lastName}`
					: user.companyProfile.name
			)
			const verificationLink = `${this.frontend_url}/email-verification?token=${token}&email=${user.email}`

			const message =
				user.userType === 'PERSONAL'
					? PERSONAL_USER_MESSAGE
					: COMPANY_USER_MESSAGE

			const steps =
				user.userType === 'PERSONAL' ? PERSONAL_USER_STEPS : COMPANY_USER_STEPS

			const emailHtml = await render(
				WelcomeUser({
					steps,
					message,
					name,
					verificationLink,
				})
			)

			const smtpResponse = await this.mailerService.sendMail({
				to: user.email,
				subject: 'Bienvenido a Journeys',
				html: emailHtml,
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
