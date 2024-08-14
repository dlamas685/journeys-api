import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { SessionService } from './session.service'
import { UsersService } from './users.service'

@Injectable()
export class AuthService {
	constructor(
		private sessionService: SessionService,
		private usersService: UsersService
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.usersService.findByEmail(email)
		const match = bcrypt.compareSync(password, user.password)

		if (user && match) {
			delete user.password
			return user
		}
		return null
	}

	async login(user: User, rememberMe: boolean) {
		const session = await this.sessionService.create(user, rememberMe)
		return session
	}
}
