import { ApiProperty } from '@nestjs/swagger'

export class GoogleEntity {
	@ApiProperty()
	provider: string

	@ApiProperty()
	providerAccountId: string

	@ApiProperty()
	accessToken: string

	@ApiProperty()
	refreshToken: string

	@ApiProperty()
	email: string

	@ApiProperty()
	imageUrl: string
}
