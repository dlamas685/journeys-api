import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'
import { PlacesService } from '../google-maps/services/places.service'
import { TripsService } from '../trips/trips.service'
import { UsersService } from '../users/users.service'
import { CreateRealTimeSessionDto } from './dtos/create-real-time-session.dto'
import { RealTimeSessionEntity } from './entities/real-time-session.entity'
import { generateInstructions } from './helpers/generate-instructions.helper'

@Injectable()
export class AssistantService {
	private openai: OpenAI
	private assistantId: string

	constructor(
		private config: ConfigService,
		private trips: TripsService,
		private users: UsersService,
		private places: PlacesService
	) {
		this.openai = new OpenAI({
			apiKey: this.config.get('OPENAI_API_KEY'),
		})

		this.assistantId = this.config.get('OPENAI_ASSISTANT_ID')
	}

	async createSession(userId: string, sessionDto: CreateRealTimeSessionDto) {
		const { tripId } = sessionDto

		const trip = await this.trips.findOne(userId, tripId)

		const user = await this.users.findOne(userId)

		const instructions = generateInstructions(user, trip, {})

		console.log(instructions)

		const session = await this.openai.beta.realtime.sessions.create({
			model: 'gpt-4o-mini-realtime-preview',
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
}
