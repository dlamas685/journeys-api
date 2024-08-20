import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAccountDto {
	@IsString()
	@IsNotEmpty()
	userId: string

	@IsString()
	@IsNotEmpty()
	provider: string

	@IsString()
	@IsNotEmpty()
	providerAccountId: string

	@IsString()
	@IsNotEmpty()
	refreshToken: string

	@IsString()
	@IsNotEmpty()
	accessToken: string
}
