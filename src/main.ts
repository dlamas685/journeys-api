import {
	ClassSerializerInterceptor,
	Logger,
	ValidationPipe,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter'
import { corsConfig } from './config'

async function bootstrap() {
	const logger = new Logger('Bootstrap')

	const app = await NestFactory.create(AppModule)

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

	SwaggerModule.setup('docs', app, document)

	const port = app.get(ConfigService).get('PORT')

	await app.listen(port)

	logger.log(`Application is running on port ${port} 🚀`)
}
bootstrap()
