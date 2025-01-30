import { protos } from '@googlemaps/routing'
import { getUnixTime } from 'date-fns/getUnixTime'
import { parseISO } from 'date-fns/parseISO'
import { set } from 'date-fns/set'

export const toTimestamp = (
	date: string,
	time: string
): protos.google.protobuf.ITimestamp => {
	const baseDate = parseISO(date)

	const [hours, minutes] = time.split(':').map(Number)

	const adjustedDate = set(baseDate, {
		hours,
		minutes,
		seconds: 0,
		milliseconds: 0,
	})

	const seconds = getUnixTime(adjustedDate)

	const nanos = 0

	return { seconds, nanos }
}
