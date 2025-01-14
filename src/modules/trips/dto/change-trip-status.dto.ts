import { ApiProperty } from '@nestjs/swagger'
import { TripStatus } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class ChangeTripStatusDto {
	@IsString()
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ example: '9d8f5715-2e7c-4e64-8e34-35f510c12e66' })
	id: string

	@IsEnum(TripStatus)
	@ApiProperty({
		enum: TripStatus,
		example: Object.keys(TripStatus).join(' | '),
	})
	tripStatus: TripStatus
}
