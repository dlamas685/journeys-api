export const formatTime = (seconds: number) => {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)

	if (hours > 0 && minutes > 0) {
		return `${hours}h ${minutes}min`
	} else if (hours > 0) {
		return `${hours}h`
	} else {
		return `${minutes}min`
	}
}
