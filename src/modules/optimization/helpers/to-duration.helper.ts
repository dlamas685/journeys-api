import { protos } from '@googlemaps/routing'

export const toDuration = (time: string): protos.google.protobuf.IDuration => {
	const [hours, minutes] = time.split(':').map(Number)

	const totalSeconds = (hours || 0) * 3600 + (minutes || 0) * 60

	const nanos = 0

	return { seconds: totalSeconds, nanos }
}
