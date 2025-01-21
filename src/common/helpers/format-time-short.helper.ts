import { formatDuration } from 'date-fns/formatDuration'

export const formatTimeShort = (time: string) => {
	const [hours, minutes] = time.split(':').map(Number)

	const duration = {
		hours: hours || 0,
		minutes: minutes || 0,
	}

	const formatted = formatDuration(duration, {
		delimiter: ' ',
	})

	return formatted
		.replace('hours', 'h')
		.replace('hour', 'h')
		.replace('minutes', 'm')
		.replace('minute', 'm')
}
