import { protos, RoutesClient, v2 } from '@googlemaps/routing'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RoutesService {
	private client: RoutesClient

	constructor() {
		this.client = new v2.RoutesClient()
	}

	async getRoutes() {
		const origin = {
			location: {
				latLng: {
					latitude: 37.419734,
					longitude: -122.0827784,
				},
			},
		}
		const destination = {
			location: {
				latLng: {
					latitude: 37.41767,
					longitude: -122.079595,
				},
			},
		}

		const response = await this.client.computeRoutes(
			{
				origin,
				destination,
				travelMode: protos.google.maps.routing.v2.RouteTravelMode.DRIVE,
				languageCode: 'es',
				regionCode: 'ar',
				routingPreference:
					protos.google.maps.routing.v2.RoutingPreference.TRAFFIC_AWARE_OPTIMAL,
			},
			{
				otherArgs: {
					headers: {
						'Content-Type': 'application/json',
						'X-Goog-FieldMask':
							'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
					},
				},
			}
		)

		return response[0]
	}
}
