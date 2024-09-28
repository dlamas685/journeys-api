export const imageFilter = (
	req: Express.Request,
	file: Express.Multer.File,
	callback: (error: Error | null, acceptFile: boolean) => void
) => {
	if (!file) return callback(new Error('File is empty'), false)

	const fileExtension = file.mimetype.split('/')[1]
	const validExtensions = ['jpg', 'jpeg', 'png']

	if (validExtensions.includes(fileExtension)) {
		return callback(null, true)
	}

	callback(null, false)
}
