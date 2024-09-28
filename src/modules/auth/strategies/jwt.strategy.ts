import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { TokenPayload } from '../types/token-payload.type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		const secret = configService.get<string>('JWT_SECRET')

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: secret,
		})
	}

	async validate(payload: TokenPayload) {
		return { userId: payload.sub, email: payload.email }
	}
}
