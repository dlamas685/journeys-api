import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { Response } from 'express'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const message = this.getErrorMessage(exception)

		const status = this.getHttpStatus(exception.code)
		response.status(status).json({
			statusCode: status,
			message: message,
			error: exception.code,
		})
	}

	private getErrorMessage(
		exception: Prisma.PrismaClientKnownRequestError
	): string {
		switch (exception.code) {
			case 'P2002':
				return `Ya existe un registro con el mismo valor para el campo único '${exception.meta?.target}'.`
			case 'P2000':
				return `El valor proporcionado para uno de los campos es demasiado largo.`
			case 'P2025':
				return `El registro que intenta actualizar/eliminar no existe.`
			default:
				return 'Ocurrió un error inesperado.'
		}
	}

	private getHttpStatus(code: string): HttpStatus {
		switch (code) {
			case 'P2002':
				return HttpStatus.CONFLICT
			case 'P2000':
				return HttpStatus.BAD_REQUEST
			case 'P2025':
				return HttpStatus.NOT_FOUND
			default:
				return HttpStatus.INTERNAL_SERVER_ERROR
		}
	}
}
