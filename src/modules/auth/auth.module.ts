import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { UsersModule } from 'src/modules/users/users.module'
import { AuthController } from './controllers/auth.controller'
import { VerificationTokensController } from './controllers/verification-tokens.controller'
import { AuthService } from './services/auth.service'
import { CleanupService } from './services/cleanup.service'
import { TokensService } from './services/tokens.service'
import { VerificationTokensService } from './services/verification-tokens.service'
import { GoogleStrategy } from './strategies/google.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				secret: config.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: '60s' },
			}),
		}),
		PassportModule,
		UsersModule,
	],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		GoogleStrategy,
		PrismaService,
		CleanupService,
		TokensService,
		VerificationTokensService,
	],
	controllers: [AuthController, VerificationTokensController],
})
export class AuthModule {}
