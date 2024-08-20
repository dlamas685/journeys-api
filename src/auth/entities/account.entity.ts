import { ApiProperty } from '@nestjs/swagger'
import { Account } from '@prisma/client'

export class AccountEntity implements Account {
	@ApiProperty()
	id: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	provider: string

	@ApiProperty()
	providerAccountId: string

	@ApiProperty({ required: false, nullable: true })
	refreshToken: string | null

	@ApiProperty({ required: false, nullable: true })
	accessToken: string | null
}
