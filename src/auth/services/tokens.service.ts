import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from '../entities'
import { TokenPayload } from '../types/token-payload.type'

@Injectable()
export class TokensService {
	constructor(private jwt: JwtService) {}

	async create(user: UserEntity, expiresIn: string | number): Promise<string> {
		const payload: TokenPayload = {
			email: user.email,
			sub: user.id,
		}

		const token = this.jwt.sign(payload, {
			expiresIn,
		})

		return token
	}

	async validate(token: string): Promise<TokenPayload> {
		try {
			const payload = this.jwt.verify<TokenPayload>(token)

			return payload
		} catch (error) {
			throw new UnauthorizedException('Token inválido')
		}
	}
}
