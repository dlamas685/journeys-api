import polyline from '@mapbox/polyline'

export const decodePolyline = (
	encodedPolyline: string
): { latitude: number; longitude: number }[] => {
	const decodedPoints = polyline.decode(encodedPolyline)
	return decodedPoints.map(([latitude, longitude]) => ({ latitude, longitude }))
}
