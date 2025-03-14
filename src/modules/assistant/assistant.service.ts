import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import OpenAI from 'openai'
import { PlacesService } from '../google-maps/services/places.service'
import { AdvancedWaypointDto, CriteriaDto } from '../optimization/routes/dtos'
import { TripsService } from '../trips/trips.service'
import { UsersService } from '../users/users.service'
import { CreateRealTimeSessionDto } from './dtos/create-real-time-session.dto'
import { RealTimeSessionEntity } from './entities/real-time-session.entity'
import { generateInstructions } from './helpers/generate-instructions.helper'

@Injectable()
export class AssistantService {
	private openai: OpenAI

	constructor(
		private readonly config: ConfigService,
		private readonly trips: TripsService,
		private readonly users: UsersService,
		private readonly places: PlacesService
	) {
		this.openai = new OpenAI({
			apiKey: this.config.get('OPENAI_API_KEY'),
		})
	}

	async createSession(userId: string, sessionDto: CreateRealTimeSessionDto) {
		const { tripId } = sessionDto

		const trip = await this.trips.findOne(userId, tripId)

		const user = await this.users.findOne(userId)

		const criteria = plainToInstance(CriteriaDto, trip.criteria)

		const alternatives =
			criteria.advancedCriteria.interestPoints &&
			criteria.advancedCriteria.interestPoints.length > 0
				? await this.findAlternativesPOI(
						criteria.advancedCriteria.interestPoints
					)
				: []

		const instructions = generateInstructions(user, trip, alternatives)

		const session = await this.openai.beta.realtime.sessions.create({
			model: 'gpt-4o-realtime-preview',
			voice: 'shimmer',
			modalities: ['audio', 'text'],
			temperature: 0.8,
			turn_detection: {
				threshold: 0.5,
				prefix_padding_ms: 300,
				silence_duration_ms: 500,
				type: 'server_vad',
			},
			instructions,
		})

		return new RealTimeSessionEntity({
			clientSecret: session.client_secret.value,
			instructions: session.instructions,
		})
	}

	async findAlternativesPOI(interestPoints: AdvancedWaypointDto[]) {
		const alternativesPOI = await Promise.all(
			interestPoints.map(interestPoint => {
				return this.places
					.getPlaceDetails(interestPoint.placeId)
					.then(async placeDetails => {
						const places = await this.places.nearbySearch(
							placeDetails.location,
							placeDetails.types
						)

						return {
							interestPoint,
							places,
						}
					})
			})
		)

		return alternativesPOI
	}
}
