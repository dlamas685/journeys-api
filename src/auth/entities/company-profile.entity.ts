import { ApiProperty } from '@nestjs/swagger'
import { CompanyProfile } from '@prisma/client'

export class CompanyProfileEntity implements CompanyProfile {
	@ApiProperty()
	userId: string

	@ApiProperty()
	name: string

	@ApiProperty()
	cuit: string
}
