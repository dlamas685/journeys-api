import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

export class ReplicateTripDto {
	@IsUUID()
	@ApiProperty()
	id: string

	@IsNotEmpty()
	@ApiProperty()
	code: string

	@IsDateString()
	@IsOptional()
	@ApiPropertyOptional()
	departureTime: string
}
