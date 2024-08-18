import { ApiProperty } from '@nestjs/swagger'
import { UserEntity } from './user.entity'

export class AuthEntity {
	@ApiProperty()
	accessToken: string

	@ApiProperty()
	expires: number

	@ApiProperty({ type: UserEntity })
	user: UserEntity

	constructor({ user, ...data }: Partial<AuthEntity>) {
		Object.assign(this, data)
		this.user = new UserEntity(user)
	}
}
