import { ApiProperty } from '@nestjs/swagger'
import { Prisma, Trip, TripStatus } from '@prisma/client'

export class TripEntity implements Trip {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty({ enum: TripStatus, type: TripEntity })
	tripStatus: TripStatus

	@ApiProperty()
	origin: string

	@ApiProperty()
	destination: string

	@ApiProperty()
	departureTime: Date

	@ApiProperty()
	arrivalTime: Date

	@ApiProperty()
	totalDistance: number | null

	@ApiProperty()
	totalDuration: number | null

	@ApiProperty()
	presets: Prisma.JsonValue | null

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date | null

	@ApiProperty()
	formattedDuration: string | null

	@ApiProperty()
	formattedDistance: string | null

	constructor(partial: Partial<TripEntity>) {
		Object.assign(this, partial)
		this.formattedDuration = this.getFormattedDuration()
		this.formattedDistance = this.getFormattedDistance()
	}

	private getFormattedDuration(): string {
		/* 
		- 86400 is the the total seconds in a day (60 seconds * 60 minutes * 24 hours).
		- 3600 is the total seconds in a hour (60min * 60s)
		*/
		const duration = this.totalDuration ?? 0
		const day = Math.floor(duration / (3600 * 24))
		const [hours, minutes, seconds] = new Date(duration * 1000)
			.toISOString()
			.slice(11, 19)
			.split(':')

		const result: string[] = []
		if (day > 0) result.push(`${day}d`)
		if (+hours > 0) result.push(`${+hours}h`)
		if (+minutes > 0) result.push(`${+minutes}min`)
		if (+seconds > 0) result.push(`${+seconds}s`)

		return result.join(' ')
	}

	private getFormattedDistance(): string {
		const kilometers: number = this.totalDistance / 1000
		return `${kilometers.toFixed(2)} km`
	}
}
