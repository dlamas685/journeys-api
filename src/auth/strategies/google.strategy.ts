import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { plainToClass } from 'class-transformer'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'

import { GoogleEntity } from '../entities'
import { AuthService } from '../services/auth.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		configService: ConfigService,
		private authService: AuthService
	) {
		super({
			clientID: configService.get('GOOGLE_CLIENT_ID'),
			clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
			callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
			scope: ['email', 'profile'],
		})
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback
	): Promise<any> {
		const { emails, photos, provider, id } = profile

		const google = plainToClass(GoogleEntity, {
			provider,
			providerAccountId: id,
			accessToken,
			refreshToken,
			email: emails[0].value,
			imageUrl: photos[0].value,
		})

		const user = await this.authService.validateGoogleUser(google)

		done(null, user)
	}
}
