import { Prisma, User, UserType, type PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const initialUsers: Prisma.UserCreateInput[] = [
	{
		email: 'messi@test.com',
		emailVerified: new Date(),
		password: bcrypt.hashSync('Hola123?', 10),
		userType: UserType.PERSONAL,
		personalProfile: {
			create: {
				dni: '23-33016244-9',
				firstName: 'Lionel Andres',
				lastName: 'Messi',
				phone: '3874779262',
				address: 'Juramento 334, Salta, Salta, Argentina',
				birthDate: new Date(1987, 6, 24),
			},
		},
	},
	{
		email: 'acme@test.com',
		emailVerified: new Date(),
		password: bcrypt.hashSync('Hola123?', 10),
		userType: UserType.COMPANY,
		companyProfile: {
			create: {
				name: 'ACME',
				cuit: '30-51859132-7',
				phone: '3874268880',
				taxAddress: 'Av. Belgrano 251, Salta, Salta, Argentina',
				manager: 'Warner Bros.',
			},
		},
	},
]

const seedUsers = async (prisma: PrismaClient): Promise<User[]> => {
	const start = Date.now()

	console.log('Seeding users...')

	// clean up before the seeding (optional)
	const deletePersonalProfile = prisma.personalProfile.deleteMany()
	const deleteCompanyProfile = prisma.companyProfile.deleteMany()
	const deleteFavoriteAddress = prisma.favoriteAddress.deleteMany()
	const deleteFavoritePlaces = prisma.favoritePlace.deleteMany()
	const deleteActivityTemplates = prisma.activityTemplate.deleteMany()
	const deleteUsers = prisma.user.deleteMany()

	// The transaction runs synchronously so deleteUsers must run last.
	await prisma.$transaction([
		deletePersonalProfile,
		deleteCompanyProfile,
		deleteFavoriteAddress,
		deleteFavoritePlaces,
		deleteActivityTemplates,
		deleteUsers,
	])

	const records: User[] = []
	for (const user of initialUsers) {
		const newUser = await prisma.user.create({
			data: user,
		})
		records.push(newUser)
	}

	const end = Date.now()
	console.log(`Seeding users completed in ${end - start}ms`)

	return records
}

export default seedUsers
