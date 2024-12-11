import { PrismaClient } from '@prisma/client'
import seedUsers from './0_users.seed'
import seedFavoriteAddress from './1_favorite-address.seed'
import seedFavoritePlace from './2_favorite-places.seed'
import seedFleet from './3_fleet-module.seed'
import seedActivitiesTemplate from './4_activities-template.seed'

const prisma = new PrismaClient()

async function main() {
	const start = new Date()
	console.log('🌱Seeding database...')

	const users = await seedUsers(prisma)
	await seedFavoriteAddress(prisma, users[0].id)
	await seedFavoritePlace(prisma, users[0].id)
	await seedActivitiesTemplate(prisma, users[0].id)
	await seedFleet(prisma, users[1].id)

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
