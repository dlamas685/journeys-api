import { ApiProperty } from '@nestjs/swagger'
import { PersonalProfile } from '@prisma/client'

export class PersonalProfileEntity implements PersonalProfile {
	@ApiProperty()
	userId: string

	@ApiProperty({ required: false, nullable: true })
	dni: string | null

	@ApiProperty()
	firstName: string

	@ApiProperty({ required: false, nullable: true })
	lastName: string

	@ApiProperty({ required: false, nullable: true })
	phone: string | null

	@ApiProperty({ required: false, nullable: true })
	address: string | null

	@ApiProperty({ required: false, nullable: true })
	birthDate: Date | null
}
