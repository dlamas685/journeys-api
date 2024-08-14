import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from 'src/common/services/prisma.service'
import { AuthController } from './auth.controller'
import { AccountService } from './services/account.service'
import { AuthService } from './services/auth.service'
import { CleanupService } from './services/cleanup.service'
import { UsersService } from './services/users.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
	imports: [
		PassportModule,
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
		PrismaService,
		CleanupService,
		UsersService,
		AccountService,
	],
	controllers: [AuthController],
})
export class AuthModule {}
