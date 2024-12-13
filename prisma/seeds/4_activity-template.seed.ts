import { faker } from '@faker-js/faker'
import { ActivityTemplate, type PrismaClient } from '@prisma/client'

type MockActivity = {
	id: string
	name: string
	description: string
	duration: number
}

function createMockActivity(): MockActivity {
	return <MockActivity>{
		id: faker.string.uuid(),
		name: faker.word.noun(),
		description: faker.commerce.productDescription(),
		duration: Math.floor(Math.random() * (60 - 10)) + 10, // between 10 and 60 min
	}
}

function createManyMockActivities(): MockActivity[] {
	const mockActivities: MockActivity[] = []
	const maxRecords = faker.number.int({ min: 3, max: 15 })

	for (let i = 0; i < maxRecords; i++) {
		mockActivities.push(createMockActivity())
	}

	return mockActivities
}

const seedActivitiesTemplate = async (
	prisma: PrismaClient,
	userId: string
): Promise<ActivityTemplate[]> => {
	const start = Date.now()
	console.log('🌱Seeding Activities Template...')

	// clean up before the seeding (optional)
	await prisma.activityTemplate.deleteMany({ where: { userId } })

	const records: ActivityTemplate[] = []

	for (let i = 0; i < 20; i++) {
		try {
			const newActivitiesTemplate = await prisma.activityTemplate.create({
				data: {
					userId,
					name: faker.music.artist(),
					description: faker.lorem.sentence(),
					activities: [...createManyMockActivities()],
				},
			})
			records.push(newActivitiesTemplate)
		} catch (error) {
			console.log(error)
		}
	}

	const end = Date.now()
	console.log(`🌱Seeding Activities Template completed in ${end - start}ms`)
	return records
}

export default seedActivitiesTemplate
