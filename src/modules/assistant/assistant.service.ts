import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import OpenAI from 'openai'
import { CriteriaDto } from '../optimization/routes/dtos'
import { TripsService } from '../trips/trips.service'
import { UsersService } from '../users/users.service'
import { CreateRealTimeSessionDto } from './dtos/create-real-time-session.dto'
import { RealTimeSessionEntity } from './entities/real-time-session.entity'

@Injectable()
export class AssistantService {
	private openai: OpenAI
	private assistantId: string

	constructor(
		private config: ConfigService,
		private trips: TripsService,
		private users: UsersService
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

		const criteria = plainToInstance(CriteriaDto, trip.criteria)

		const instructions = `

			Eres un asistente de viajes que responde preguntas usando la información proporcionada.

			Tu trabajo es responder acerca de los criterios o configuraciones definidos en un viaje, los resultados obtenidos en la optimización del mismo y otros cálculos adicionales que se te facilitaran.

			Se amable, cordial y amigable siempre.

			Si no tienes suficiente información solicita más detalles al usuario.

			Si no conoces la respuesta debido a falta de información propia o a información que no esta relacionada con tu trabajo responde "Lo siento, no soy capaz de responder tu pregunta." 

			Las respuestas deben ser cortas simulando una conversación.

			Recuerda y usa el nombre de la persona que se te proporcionará, no es necesario que se use en cada respuesta.

			Saluda al usuario de forma cordial al iniciar usando palabras como "Hola" "Bienvenido" "Buen día" "Buenas noches" "Buenas tardes"  y realizando una breve presentación si es la primera vez que conversas con él.
		
			Comienza saludando y presentándote al usuario.

			Datos de la persona:
			- Nombre: ${user.personalProfile.firstName} ${user.personalProfile.lastName}

			Criterios del viaje:
			- Origen: 
				- Dirección: ${criteria.basicCriteria.origin.address}
				- Nombre: ${criteria.basicCriteria.origin.name}
			- Destino:
				- Dirección: ${criteria.basicCriteria.destination.address}
				- Nombre: ${criteria.basicCriteria.destination.name}
			- Fecha de inicio: ${criteria.basicCriteria.departureTime}
			- Puntos de interés:
				${criteria.basicCriteria.interestPoints.map(interestPoint => `-Dirección:${interestPoint.address} -Nombre:${interestPoint.name}`).join('\n')}
			`

		const session = await this.openai.beta.realtime.sessions.create({
			model: 'gpt-4o-mini-realtime-preview',
			voice: 'sage',
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
