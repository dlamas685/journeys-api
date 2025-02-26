import { PlacesClient, protos, v1 } from '@googlemaps/places'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import {
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common'
import { REDIS_PREFIXES } from 'src/common/constants'

@Injectable()
export class PlacesService {
	private client: PlacesClient
	private readonly logger: Logger = new Logger(PlacesService.name)

	constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
		this.client = new v1.PlacesClient()
	}

	async getPlaceDetails(placeId: string, otherFields: string[] = []) {
		const detailCacheKey = `${REDIS_PREFIXES.PLACES_DETAIL}${placeId}`

		const cachedPlaceDetails =
			await this.cacheManager.get<protos.google.maps.places.v1.IPlace>(
				detailCacheKey
			)

		const defaultFields = ['id', 'displayName', 'location', 'formattedAddress']

		const requestedFields = [...new Set([...defaultFields, ...otherFields])]

		if (
			cachedPlaceDetails &&
			!requestedFields.some(field => !(field in cachedPlaceDetails))
		) {
			this.logger.log('Using cached place details')
			return cachedPlaceDetails
		}

		this.logger.log(
			`Fetching place details from Google Places API${cachedPlaceDetails ? ' (missing fields detected)' : ''}`
		)

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
							'X-Goog-FieldMask': requestedFields.join(','),
						},
					},
				}
			)

			await this.cacheManager.set(detailCacheKey, result)

			return result
		} catch (error) {
			this.logger.error(
				`Error fetching place details for placeId: ${placeId}`,
				error
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
		const searchCacheKey = `${REDIS_PREFIXES.ADDRESSES_SEARCH}${input}`

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
		const searchCacheKey = `${REDIS_PREFIXES.PLACES_SEARCH}${textQuery}`

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

	async nearbySearch(
		center: protos.google.type.ILatLng,
		includedTypes: string[]
	) {
		try {
			const [result] = await this.client.searchNearby(
				{
					regionCode: 'ar',
					languageCode: 'es',
					locationRestriction: {
						circle: {
							center,
							radius: 1000,
						},
					},
					maxResultCount: 10,
					includedTypes,
				},
				{
					otherArgs: {
						headers: {
							'Content-Type': 'application/json',
							'X-Goog-FieldMask':
								'places.id,places.displayName,places.formattedAddress,places.location,places.currentOpeningHours,places.currentSecondaryOpeningHours,places.rating,places.regularOpeningHours,places.regularSecondaryOpeningHours',
						},
					},
				}
			)

			return result.places
		} catch (error) {
			this.logger.error(`Error fetching nearby places` + error)

			throw new InternalServerErrorException('Error fetching nearby places')
		}
	}
}
