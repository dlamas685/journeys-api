export const getPublicIdFromUrl = (url: string): string => {
	const parts = url.split('/')
	const lastPart = parts[parts.length - 1]
	return lastPart.split('.')[0]
}
