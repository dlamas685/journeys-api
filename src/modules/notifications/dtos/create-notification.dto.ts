import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { NotificationType } from '@prisma/client'
import {
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator'

export class CreateNotificationDto {
	@IsUUID()
	@ApiProperty()
	recipientId: string

	@IsOptional()
	@IsEnum(NotificationType)
	@ApiPropertyOptional({
		enum: NotificationType,
		example: Object.keys(NotificationType).join(' | '),
	})
	type: NotificationType = NotificationType.SYSTEM

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	subject: string = null

	@IsOptional()
	@IsString()
	@ApiProperty()
	message?: string

	@IsDateString()
	@IsOptional()
	@ApiPropertyOptional()
	readAt?: Date
}
