import { Client, PlaceData } from '@googlemaps/google-maps-services-js'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { HttpException, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PlacesService {
	private apiKey: string
	private client: Client

	constructor(
		private readonly config: ConfigService,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
	) {
		this.client = new Client()
		this.apiKey = this.config.get<string>('GOOGLE_MAPS_API_KEY')
	}

	async getPlaceDetails(placeId: string, otherFields: string[] = []) {
		const detailCacheKey = `place-details-${placeId}`

		const cachedPlaceDetails =
			await this.cacheManager.get<Partial<PlaceData>>(detailCacheKey)

		if (cachedPlaceDetails) {
			console.log('Using cached place details')
			return cachedPlaceDetails
		}

		console.log('Fetching place details from Google Places API')

		try {
			const response = await this.client.placeDetails({
				params: {
					place_id: placeId,
					key: this.apiKey,
					fields: ['name', 'formatted_address', ...otherFields],
				},
			})

			await this.cacheManager.set(detailCacheKey, response.data.result)

			return response.data.result
		} catch (error) {
			throw new HttpException(error.response.data, error.response.status)
		}
	}
}
