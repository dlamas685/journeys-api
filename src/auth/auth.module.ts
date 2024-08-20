import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { MailsModule } from 'src/common/modules/mails/mails.module'
import { MailsService } from 'src/common/modules/mails/mails.service'
import { PrismaService } from 'src/common/services/prisma.service'
import { AuthController } from './auth.controller'
import { AccountsService } from './services/accounts.service'
import { AuthService } from './services/auth.service'
import { CleanupService } from './services/cleanup.service'
import { TokensService } from './services/tokens.service'
import { UsersService } from './services/users.service'
import { GoogleStrategy } from './strategies/google.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
	imports: [
		PassportModule,
		MailsModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: '60s' },
			}),
		}),
	],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		GoogleStrategy,
		PrismaService,
		CleanupService,
		UsersService,
		AccountsService,
		MailsService,
		TokensService,
	],
	controllers: [AuthController],
})
export class AuthModule {}
