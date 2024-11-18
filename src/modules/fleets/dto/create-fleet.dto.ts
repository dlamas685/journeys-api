import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator'

export class CreateFleetDto {
	@ApiProperty({ example: 'Avengers' })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiPropertyOptional({
		example: 'Lorem ipsum dolor sit',
	})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	description: string

	@ApiPropertyOptional({ example: 2 })
	@IsInt()
	@Min(2)
	@Max(10)
	maxVehicles: number = 2

	@ApiPropertyOptional({ example: 2 })
	@IsInt()
	@Min(2)
	@Max(10)
	maxDrivers: number = 2
}
