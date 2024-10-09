import { faker } from '@faker-js/faker'
import { randFullAddress } from '@ngneat/falso'
import { FavoriteAddress, Prisma, type PrismaClient } from '@prisma/client'

type FavoriteAddressMock = Omit<Prisma.FavoriteAddressCreateInput, 'user'>

function getInitialFavoriteAddresses() {
	const results = new Array<FavoriteAddressMock>(15)

	for (let i = 0; i < results.length; i++) {
		results[i] = {
			address: randFullAddress({ includeCounty: false }),
			alias: faker.word.words({ count: { min: 1, max: 3 } }),
			latitude: faker.location.latitude(),
			longitude: faker.location.longitude(),
		}
	}

	return results
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
	const mock = getInitialFavoriteAddresses()
	for (const favoriteAddress of mock) {
		try {
			const newFavoriteAddress = await prisma.favoriteAddress.create({
				data: {
					userId,
					...favoriteAddress,
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
