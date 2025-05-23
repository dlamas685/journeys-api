import { faker, fakerES_MX } from '@faker-js/faker'
import { Fleet, type PrismaClient } from '@prisma/client'

// TODO: Try to implement next time
function randomImageSelector(): string {
	// dado un array de con urls de imagenes se selecciona una al azar y se la devuelve
	throw new Error()
}

type MockFleet = {
	name: string
	description: string
	maxVehicles: number
	maxDrivers: number
}

type MockVehicle = {
	userId: string
	licensePlate: string
	make: string
	model: string
	year: number
	vin: string
	notes: string
}

type MockDriver = {
	userId: string
	licenseNumber: string
	name: string
	notes: string
}

function createMockFleet(): MockFleet {
	return <MockFleet>{
		name: faker.word.noun(),
		description: faker.lorem.text(),
		maxVehicles: faker.number.int({ min: 10, max: 25 }),
		maxDrivers: faker.number.int({ min: 13, max: 30 }),
	}
}

function createMockVehicle(userId?: string): MockVehicle {
	return <MockVehicle>{
		userId: userId ?? faker.string.uuid(),
		licensePlate: faker.helpers.fromRegExp(/[A-Z]{2}-[0-9]{3}-[A-Z]{2}/),
		make: faker.vehicle.manufacturer(),
		model: faker.vehicle.model(),
		year: faker.number.int({ min: 2017, max: 2024 }),
		vin: faker.vehicle.vin(),
		notes: faker.lorem.text(),
	}
}

function createMockDriver(userId?: string): MockDriver {
	const fullName = faker.person.fullName()

	return <MockDriver>{
		userId: userId ?? faker.string.uuid(),
		licenseNumber: faker.helpers.fromRegExp(/[0-9]{7,8}/),
		name: fullName,
		notes: faker.person.bio(),
	}
}

function createMockDriverV2(userId?: string): MockDriver {
	const fullName = fakerES_MX.person.fullName()

	return <MockDriver>{
		userId: userId ?? fakerES_MX.string.uuid(),
		licenseNumber: fakerES_MX.helpers.fromRegExp(/[A-Z]{3}[0-9]{6}/), // como si fuese un pasaporte
		name: fullName,
		notes: fakerES_MX.person.bio(),
	}
}

function createManyMockDrivers(userId: string): MockDriver[] {
	const mockDrivers: MockDriver[] = []
	const maxRecords = faker.number.int({ min: 13, max: 30 })

	for (let i = 0; i < maxRecords; i++) {
		mockDrivers.push(createMockDriver(userId))
	}

	return mockDrivers
}

function createManyMockVehicles(userId: string): MockVehicle[] {
	const mockVehicles: MockVehicle[] = []
	const maxRecords = faker.number.int({ min: 10, max: 25 })

	for (let i = 0; i < maxRecords; i++) {
		mockVehicles.push(createMockVehicle(userId))
	}

	return mockVehicles
}

const seedFleet = async (
	prisma: PrismaClient,
	userId: string
): Promise<Fleet[]> => {
	const start = Date.now()
	console.log('🌱Seeding Fleet Module...')

	// clean up before the seeding (optional)
	await prisma.vehicle.deleteMany()
	await prisma.driver.deleteMany()
	await prisma.fleet.deleteMany()

	const records: Fleet[] = []

	for (let i = 0; i < 5; i++) {
		try {
			const newFleet = await prisma.fleet.create({
				data: {
					userId,
					...createMockFleet(),
					drivers: {
						createMany: {
							data: createManyMockDrivers(userId),
						},
					},
					vehicles: {
						createMany: {
							data: createManyMockVehicles(userId),
						},
					},
				},
				include: {
					drivers: true,
					vehicles: true,
				},
			})
			records.push(newFleet)
		} catch (error) {
			console.log(error)
		}
	}
	// add empty fleet for test propose
	for (let i = 0; i < 25; i++) {
		try {
			const newFleet = await prisma.fleet.create({
				data: {
					userId,
					...createMockFleet(),
				},
			})
			records.push(newFleet)
		} catch (error) {
			console.log(error)
		}
	}

	const end = Date.now()
	console.log(`🌱Seeding Fleet Module completed in ${end - start}ms`)
	return records
}

export const seedVehicleAndDriver = async (
	prisma: PrismaClient,
	userId: string
): Promise<any> => {
	// add drivers and vehicle without fleet
	const drivers = []
	const vehicles = []

	for (let i = 0; i < 15; i++) {
		try {
			const driver = await prisma.driver.create({
				data: {
					userId,
					...createMockDriverV2(userId),
				},
			})
			drivers.push(driver)

			const vehicle = await prisma.vehicle.create({
				data: {
					userId,
					...createMockVehicle(userId),
				},
			})
			vehicles.push(vehicle)
		} catch (error) {
			console.log(error)
		}
	}
	return { drivers, vehicles }
}

export default seedFleet
