import { Account, UserType } from '@prisma/client'

export class UserResponseDto {
	id: string
	email: string
	emailVerified?: Date | null
	imageUrl: string
	userType: UserType
	accounts?: Account[] | null
}

/*
	DTO: cuando llega y envia informacion al cliente
	Entity: cuando se interactua con la base de datos



*/
