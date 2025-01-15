import { PlacesClient, protos, v1 } from '@googlemaps/places'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import {
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common'

@Injectable()
export class PlacesService {
	private client: PlacesClient
	private readonly logger: Logger = new Logger(PlacesService.name)

	constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
		this.client = new v1.PlacesClient()
	}

	async getPlaceDetails(placeId: string, otherFields: string[] = []) {
		const detailCacheKey = `place-details-${placeId}`

		const cachedPlaceDetails =
			await this.cacheManager.get<protos.google.maps.places.v1.IPlace>(
				detailCacheKey
			)

		if (cachedPlaceDetails) {
			this.logger.log('Using cached place details')
			return cachedPlaceDetails
		}

		this.logger.log('Fetching place details from Google Places API')

		try {
			const [result] = await this.client.getPlace(
				{
					name: `places/${placeId}`,
					regionCode: 'ar',
					languageCode: 'es',
				},
				{
					otherArgs: {
						headers: {
							'Content-Type': 'application/json',
							'X-Goog-FieldMask': `id,displayName,location,formattedAddress,${otherFields.join(',')}`,
						},
					},
				}
			)

			await this.cacheManager.set(detailCacheKey, result)

			return result
		} catch (error) {
			this.logger.error(
				`Error fetching place details for placeId: ${placeId}` + error
			)
			throw new InternalServerErrorException('Error fetching place details')
		}
	}

	async searchAddresses(
		input: string,
		includedPrimaryTypes: string[] = [
			'street_address',
			'route',
			'street_number',
		]
	) {
		const searchCacheKey = `address-search-${input}`

		const cachedPlaces = await this.cacheManager.get<string[]>(searchCacheKey)

		if (cachedPlaces) {
			this.logger.log('Using cached places')
			return cachedPlaces
		}

		this.logger.log('Fetching places from Google Places API')

		try {
			const [result] = await this.client.autocompletePlaces(
				{
					input,
					languageCode: 'es',
					regionCode: 'ar',
					includedPrimaryTypes,
				},
				{
					otherArgs: {
						headers: {
							'Content-Type': 'application/json',
						},
					},
				}
			)

			this.logger.log(result.suggestions)

			const placeIds = result.suggestions.map(
				suggestion => suggestion.placePrediction.placeId
			)

			await this.cacheManager.set(searchCacheKey, placeIds)

			return placeIds
		} catch (error) {
			this.logger.error(`Error fetching places for input: ${input}` + error)
			this.logger.error(error.statusDetails)
			throw new InternalServerErrorException('Error fetching places')
		}
	}

	async searchPlaces(textQuery: string) {
		const searchCacheKey = `places-search-${textQuery}`

		const cachedPlaces = await this.cacheManager.get<string[]>(searchCacheKey)

		if (cachedPlaces) {
			console.log('Using cached places')
			return cachedPlaces
		}

		console.log('Fetching places from Google Places API')

		try {
			const [results] = await this.client.searchText(
				{
					regionCode: 'ar',
					languageCode: 'es',
					textQuery,
				},
				{
					otherArgs: {
						headers: {
							'Content-Type': 'application/json',
							'X-Goog-FieldMask': 'places.id',
						},
					},
				}
			)

			const placeIds = results.places.map(result => result.id)

			await this.cacheManager.set(searchCacheKey, placeIds)

			return placeIds
		} catch (error) {
			this.logger.error(`Error fetching places for input: ${textQuery}` + error)

			throw new InternalServerErrorException('Error fetching places')
		}
	}
}
