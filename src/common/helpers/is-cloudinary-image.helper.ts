export const isCloudinaryImage = (imageUrl: string): boolean => {
	return imageUrl.includes('res.cloudinary.com')
}
