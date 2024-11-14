import { Client } from '@googlemaps/google-maps-services-js'
import { HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PlacesService extends Client {
	private apiKey: string

	constructor(private config: ConfigService) {
		super()
		this.apiKey = this.config.get<string>('GOOGLE_MAPS_API_KEY')
	}

	async getPlaceDetails(placeId: string, otherFields: string[] = []) {
		try {
			const response = await this.placeDetails({
				params: {
					place_id: placeId,
					key: this.apiKey,
					fields: ['name', 'formatted_address', ...otherFields],
				},
			})
			return response.data.result
		} catch (error) {
			throw new HttpException(error.response.data, error.response.status)
		}
	}
}
