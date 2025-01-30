import { protos } from '@googlemaps/routing'

export const fromDuration = (
	duration: protos.google.protobuf.IDuration
): string => {
	const totalSeconds = Number(duration.seconds || 0)

	const hours = Math.floor(totalSeconds / 3600)

	const minutes = Math.floor((totalSeconds % 3600) / 60)

	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
