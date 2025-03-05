import { ApiProperty } from '@nestjs/swagger'
import { Notification, NotificationType } from '@prisma/client'

export class NotificationEntity implements Notification {
	@ApiProperty()
	id: string

	@ApiProperty()
	recipientId: string

	@ApiProperty({ enum: NotificationType, type: NotificationType })
	type: NotificationType

	@ApiProperty()
	subject: string

	@ApiProperty()
	message: string | null

	@ApiProperty()
	readAt: Date | null

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	constructor(partial: Partial<NotificationEntity>) {
		Object.assign(this, partial)
	}
}
