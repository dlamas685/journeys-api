import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { UserEntity } from '../auth/entities'
import { PrismaService } from '../prisma/prisma.service'
import { ChangePasswordDto } from './dto/change-password.dto'

@Injectable()
export class OptionsService {
	private readonly salts: number

	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService
	) {
		this.salts = this.config.get<number>('SALTS')
	}

	async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
		const { password, newPassword } = changePasswordDto

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) {
			throw new NotFoundException('Usuario no encontrado')
		}

		const isValidPassword = await bcrypt.compare(password, user.password)

		if (!isValidPassword) {
			throw new NotFoundException('Contraseña incorrecta')
		}

		const hashedPassword = await bcrypt.hash(newPassword, this.salts)

		const updatedUser = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				password: hashedPassword,
			},
		})

		return new UserEntity(updatedUser)
	}

	async hasPassword(userId: string): Promise<boolean> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) {
			throw new NotFoundException('Usuario no encontrado')
		}

		return !!user.password
	}
}
