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
	constructor(
		private mailerService: MailerService,
		private configService: ConfigService
	) {}

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
}
