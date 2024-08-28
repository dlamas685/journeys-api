import { ApiProperty } from '@nestjs/swagger'
import { VerificationToken } from '@prisma/client'

export class VerificationTokenEntity implements VerificationToken {
	@ApiProperty()
	identifier: string

	@ApiProperty()
	token: string

	@ApiProperty()
	expires: Date
}
