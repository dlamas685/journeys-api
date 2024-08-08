import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { corsConfig } from './config'

async function bootstrap() {
	const logger = new Logger('Bootstrap')

	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')

	app.enableCors(corsConfig)

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	)

	const config = new DocumentBuilder()
		.setTitle('JOURNEYS API')
		.setDescription('Aplicación para la optimización de viajes y rutas')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, config)

	SwaggerModule.setup('api', app, document)

	const port = app.get(ConfigService).get('PORT')

	await app.listen(port)

	logger.log(`Application is running on port ${port}`)
}
bootstrap()
