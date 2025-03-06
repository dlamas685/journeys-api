import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server

	async handleConnection(client: Socket) {
		const recipientId = client.handshake.query.recipientId as string

		if (!recipientId) {
			client.disconnect()
			return
		}

		client.join(recipientId)

		console.log(`Client ${client.id} joined room ${recipientId}`)
	}

	handleDisconnect(client: Socket) {
		console.log('Client disconnected', client.id)
	}
}
