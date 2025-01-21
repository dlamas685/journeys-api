import { addSeconds, format, startOfDay } from 'date-fns'

export const convertToHHMM = (seconds: number): string => {
	const time = addSeconds(startOfDay(new Date()), seconds)
	return format(time, 'HH:mm')
}
