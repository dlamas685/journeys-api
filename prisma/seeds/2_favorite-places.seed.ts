import { FavoritePlace, type PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

type MockPlace = {
	placeId?: string
	latitude?: number
	longitude?: number
}

function getMockPlaces(): MockPlace[] {
	const filePath = path.join(__dirname, '../resources/mock-places.json')
	const jsonString = fs.readFileSync(filePath, 'utf-8')
	return JSON.parse(jsonString)
}

const seedFavoritePlace = async (
	prisma: PrismaClient,
	userId: string
): Promise<FavoritePlace[]> => {
	const start = Date.now()
	console.log('🌱Seeding Favorite Places...')

	// clean up before the seeding (optional)
	await prisma.favoritePlace.deleteMany()

	const records: FavoritePlace[] = []
	const mockPlaces = getMockPlaces()

	for (const mockPlace of mockPlaces) {
		try {
			const newFavoritePlace = await prisma.favoritePlace.create({
				data: {
					userId,
					placeId: mockPlace.placeId,
				},
			})
			records.push(newFavoritePlace)
		} catch (error) {
			console.log(error)
		}
	}

	const end = Date.now()
	console.log(`🌱Seeding favorite place completed in ${end - start}ms`)
	return records
}

export default seedFavoritePlace
