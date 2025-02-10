import { FavoriteAddress, type PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

type MockAddress = {
	alias?: string
	placeId?: string
	latitude?: number
	longitude?: number
}

function getMockAddresses(): MockAddress[] {
	const filePath = path.join(__dirname, '../resources/mock-addresses.json')
	const jsonString = fs.readFileSync(filePath, 'utf-8')
	return JSON.parse(jsonString)
}

const seedFavoriteAddress = async (
	prisma: PrismaClient,
	userId: string
): Promise<FavoriteAddress[]> => {
	const start = Date.now()
	console.log('🌱Seeding Favorite Address...')

	// clean up before the seeding (optional)
	await prisma.favoriteAddress.deleteMany()

	const records: FavoriteAddress[] = []
	const mockAddresses = getMockAddresses()

	for (const mockAddress of mockAddresses) {
		try {
			const newFavoriteAddress = await prisma.favoriteAddress.create({
				data: {
					userId,
					alias: mockAddress.alias,
					placeId: mockAddress.placeId,
				},
			})
			records.push(newFavoriteAddress)
		} catch (error) {
			console.log(error)
		}
	}

	const end = Date.now()
	console.log(`🌱Seeding favorite address completed in ${end - start}ms`)
	return records
}

export default seedFavoriteAddress
