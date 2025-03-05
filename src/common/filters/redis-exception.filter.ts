import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	Logger,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(Error)
export class RedisExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(RedisExceptionFilter.name)

	catch(exception: Error, host: ArgumentsHost) {
		if (
			exception.message.includes('ECONNREFUSED') ||
			exception.message.includes('Redis')
		) {
			this.logger.error(`Redis error: ${exception.message}`)

			const ctx = host.switchToHttp()
			const response = ctx.getResponse<Response>()

			response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
				statusCode: HttpStatus.SERVICE_UNAVAILABLE,
				message: 'Error en la caché de Redis. Inténtalo más tarde.',
				error: exception.message,
			})
		} else {
			throw exception
		}
	}
}
