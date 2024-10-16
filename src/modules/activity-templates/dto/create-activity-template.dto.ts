import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	IsLatitude,
	IsLongitude,
	IsMilitaryTime,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'

export class ActivityAddressJson {
	@IsString()
	@IsNotEmpty()
	address: string

	@IsLatitude()
	latitude: number

	@IsLongitude()
	longitude: number

	@IsString()
	@IsNotEmpty()
	placeId: string
}

export class ActivitiesJson {
	@IsString()
	@IsNotEmpty()
	todo: string

	@IsMilitaryTime()
	time: string

	@IsOptional()
	@Type(() => ActivityAddressJson)
	location: ActivityAddressJson | null
}

export class CreateActivityTemplateDto {
	@ApiProperty({
		example: 'Journey Trip',
	})
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiPropertyOptional({ example: 'Amazing travel with Journey' })
	@IsOptional()
	@IsString()
	description: string

	@ApiPropertyOptional({
		example: [
			{
				name: 'Mirai',
				description: 'test feature',
				activities: [
					{
						todo: 'Sleep',
						time: '00:30', //HH:MM
					},
					{
						todo: 'Walk in the park',
						time: '00:45', //HH:MM
					},
					{
						todo: 'Drink Beer',
						time: '01:20', //HH:MM
						location: {
							address: 'Juramento 334, A4400 Salta',
							latitude: 147.2323123123,
							longitude: -13.22344123,
							placeId: 'adsdfasfdsaf',
						},
					},
					// {...}
				],
			},
		],
	})
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => ActivitiesJson)
	activities: Prisma.JsonValue
}
