import { TimestampDto } from '../dto'

export const toTimestamp = (date: string, time: string): TimestampDto => {
	const baseDate = new Date(date)

	const [hours, minutes, seconds] = time.split(':').map(Number)

	baseDate.setHours(baseDate.getHours() + hours)
	baseDate.setMinutes(baseDate.getMinutes() + minutes)
	baseDate.setSeconds(baseDate.getSeconds() + (seconds || 0))

	const milliseconds = baseDate.getTime()

	const totalSeconds = Math.floor(milliseconds / 1000)
	const nanos = (milliseconds % 1000) * 1e6

	return new TimestampDto({ seconds: totalSeconds, nanos })
}
