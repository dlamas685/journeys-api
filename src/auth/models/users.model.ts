import { Prisma } from '@prisma/client'

const userWithProfiles = Prisma.validator<Prisma.UserDefaultArgs>()({
	include: {
		companyProfile: true,
		personalProfile: true,
	},
})

const userWithAccounts = Prisma.validator<Prisma.UserDefaultArgs>()({
	include: {
		accounts: true,
	},
})

export type UserWithProfiles = Prisma.UserGetPayload<typeof userWithProfiles>

export type UserWithAccounts = Prisma.UserGetPayload<typeof userWithAccounts>

export type UserWithRelations = UserWithProfiles & UserWithAccounts
