import { PrismaClient } from '@prisma/client'
import seedUsers from './0_users.seed'
import seedFavoriteAddress from './1_favorite-address.seed'

const prisma = new PrismaClient()

async function main() {
	const start = new Date()
	console.log('🌱Seeding database...')

	const users = await seedUsers(prisma)
	const favoriteAddresses = await seedFavoriteAddress(prisma, users[0].id)

	const end = new Date()
	console.log(`🌱Seeding completed: ${end.getTime() - start.getTime()}ms`)
}

main()
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
