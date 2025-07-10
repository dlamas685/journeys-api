import {
	ClassSerializerInterceptor,
	Logger,
	ValidationPipe,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import * as basicAuth from 'express-basic-auth'
import { AppModule } from './app.module'
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter'
import { corsConfig } from './config'

async function bootstrap() {
	const logger = new Logger('Bootstrap')

	const app = await NestFactory.create(AppModule)

	const configService = app.get(ConfigService)

	app.use(cookieParser())

	app.setGlobalPrefix('api')

	app.enableCors(corsConfig)

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	)

	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

	const { httpAdapter } = app.get(HttpAdapterHost)
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

	app.use(
		['/docs', '/docs-json'],
		basicAuth({
			challenge: true,
			users: {
				[configService.get('SWAGGER_USER')]:
					configService.get('SWAGGER_PASSWORD'),
			},
		})
	)

	const config = new DocumentBuilder()
		.setTitle('JOURNEYS API')
		.setDescription('Aplicación para la optimización de viajes y rutas')
		.setVersion('1.0')
		.addTag('Auth')
		.addTag('Verification Tokens')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
			'JWT-auth'
		)
		.build()

	const document = SwaggerModule.createDocument(app, config)

	const swaggerPath = 'docs'
	SwaggerModule.setup(swaggerPath, app, document)

	const port = configService.get('PORT')

	await app.listen(port)

	logger.log(
		`🚀Application is running at "http://localhost:${port}/${swaggerPath}"`
	)
}
bootstrap()
