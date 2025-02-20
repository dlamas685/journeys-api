export function isPlaceOpenAtTime(period, hour, minutes) {
	const openHour = period.open.hour
	const openMinutes = period.open.minute || 0
	const closeHour = period.close?.hour ?? 23
	const closeMinutes = period.close?.minute ?? 59

	return (
		(hour > openHour || (hour === openHour && minutes >= openMinutes)) &&
		(hour < closeHour || (hour === closeHour && minutes <= closeMinutes))
	)
}
