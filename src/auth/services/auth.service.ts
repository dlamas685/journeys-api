import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { plainToClass } from 'class-transformer'
import { CreateUserDto } from '../dto/create-user.dto'
import { LoginResponseDto } from '../dto/login-response.dto'
import { UserResponseDto } from '../dto/user-response.dto'
import { TokenPayload } from '../models/token-payload.model'
import { UsersService } from './users.service'

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService
	) {}

	async validateUser(
		email: string,
		password: string
	): Promise<UserResponseDto> {
		const user = await this.usersService.findByEmail(email)
		const match = bcrypt.compareSync(password, user.password)

		if (user && match) {
			delete user.password
			return plainToClass(UserResponseDto, user)
		}
		return null
	}

	async login(
		user: UserResponseDto,
		rememberMe: boolean
	): Promise<LoginResponseDto> {
		const payload: TokenPayload = { email: user.email, sub: user.id }

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: rememberMe ? '30d' : '1d',
		})

		const exp = this.jwtService.decode(accessToken).exp

		const response = plainToClass(LoginResponseDto, {
			accessToken,
			exp,
			user,
		})

		return response
	}

	async userSignUp(newUser: CreateUserDto) {
		newUser.password = await this.hashPassword(newUser.password)
		const user = await this.usersService.createUser(newUser)

		return {
			message: 'email was send it',
			user: user,
		}
		// throw new Error('Method not implemented.')
	}

	async hashPassword(password: string) {
		const salt = await bcrypt.genSalt(10)
		return await bcrypt.hash(password, salt)
	}
}
