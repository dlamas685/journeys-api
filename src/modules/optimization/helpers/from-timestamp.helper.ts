import { TimestampDto } from '../dto'

export const fromTimestamp = (timestamp: TimestampDto): [Date, string] => {
	const milliseconds =
		(Number(timestamp.seconds) || 0) * 1000 +
		(Number(timestamp.nanos) || 0) / 1e6

	const fullDate = new Date(milliseconds)

	const date = new Date(
		fullDate.getFullYear(),
		fullDate.getMonth(),
		fullDate.getDate()
	)

	const hours = String(fullDate.getHours()).padStart(2, '0')
	const minutes = String(fullDate.getMinutes()).padStart(2, '0')
	const time = `${hours}:${minutes}`

	return [date, time]
}
