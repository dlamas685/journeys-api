import { protos, RoutesClient, v2 } from '@googlemaps/routing'
import {
	BadRequestException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common'

@Injectable()
export class RoutesService {
	private client: RoutesClient
	private logger: Logger = new Logger(RoutesService.name)

	constructor() {
		this.client = new v2.RoutesClient()
	}

	async computeBasicRoute(
		request: protos.google.maps.routing.v2.IComputeRoutesRequest
	) {
		try {
			const [result] = await this.client.computeRoutes(
				{
					...request,
					//TODO: This should be an constant
					regionCode: 'ar',
					languageCode: 'es-419',
					units: 'METRIC',
					polylineEncoding: 'ENCODED_POLYLINE',
					polylineQuality: 'HIGH_QUALITY',
				},
				{
					otherArgs: {
						headers: {
							'Content-Type': 'application/json',
							'X-Goog-FieldMask':
								'routes.duration,routes.distanceMeters,routes.polyline,routes.staticDuration,routes.routeLabels,routes.localized_values',
						},
					},
				}
			)

			return result
		} catch (error) {
			this.logger.error(
				`Error optimizing route for request: ${JSON.stringify(error)}`
			)

			if (error.code === HttpStatus.BAD_REQUEST) {
				throw new BadRequestException(`Invalid request: ${error.message}`)
			}

			if (error.code === HttpStatus.FORBIDDEN) {
				throw new BadRequestException(
					`The request is missing a valid API key: ${error.message}`
				)
			}

			throw new InternalServerErrorException(
				`An error occurred while processing the request: ${error.message}`
			)
		}
	}

	async computeAdvancedRoute(
		request: protos.google.maps.routing.v2.IComputeRoutesRequest
	) {
		try {
			const [result] = await this.client.computeRoutes(
				{
					...request,
					regionCode: 'ar',
					languageCode: 'es-419',
					units: 'METRIC',
					polylineEncoding: 'ENCODED_POLYLINE',
					polylineQuality: 'HIGH_QUALITY',
				},
				{
					otherArgs: {
						headers: {
							'Content-Type': 'application/json',
							'X-Goog-FieldMask':
								'routes.duration,routes.distanceMeters,routes.staticDuration,routes.routeLabels,routes.polyline,routes.legs.duration,routes.legs.distanceMeters,routes.legs.staticDuration,routes.legs.polyline,routes.legs.steps,routes.legs.localized_values,routes.legs.startLocation,routes.legs.endLocation,routes.travelAdvisory.tollInfo,routes.legs.travelAdvisory.tollInfo,routes.optimizedIntermediateWaypointIndex,routes.localized_values',
						},
					},
				}
			)

			return result
		} catch (error) {
			this.logger.error(
				`Error optimizing route for request: ${JSON.stringify(error)}`
			)

			if (error.code === HttpStatus.BAD_REQUEST) {
				throw new BadRequestException(`Invalid request: ${error.message}`)
			}

			if (error.code === HttpStatus.FORBIDDEN) {
				throw new BadRequestException(
					`The request is missing a valid API key: ${error.message}`
				)
			}

			throw new InternalServerErrorException(
				`An error occurred while processing the request: ${error.message}`
			)
		}
	}
}
