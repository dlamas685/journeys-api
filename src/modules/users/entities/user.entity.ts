import { ApiProperty } from '@nestjs/swagger'
import { User, UserType } from '@prisma/client'
import { Exclude } from 'class-transformer'
import { AccountEntity } from '../../auth/entities/account.entity'
import { CompanyProfileEntity } from './company-profile.entity'
import { PersonalProfileEntity } from './personal-profile.entity'

export class UserEntity implements User {
	@ApiProperty()
	id: string

	@ApiProperty()
	email: string

	@ApiProperty({ required: false, nullable: true, type: Date })
	emailVerified: Date | null

	@ApiProperty({ required: false, nullable: true })
	imageUrl: string | null

	@ApiProperty({ enum: UserType, type: UserEntity })
	userType: UserType

	@ApiProperty({ type: Date })
	createdAt: Date

	@ApiProperty({ required: false, nullable: true, type: Date })
	updatedAt: Date | null

	@ApiProperty({ required: false, type: AccountEntity, isArray: true })
	accounts?: AccountEntity[]

	@ApiProperty({ required: false, type: PersonalProfileEntity })
	personalProfile?: PersonalProfileEntity

	@ApiProperty({ required: false, type: CompanyProfileEntity })
	companyProfile?: CompanyProfileEntity

	@Exclude()
	password: string

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial)
	}
}
