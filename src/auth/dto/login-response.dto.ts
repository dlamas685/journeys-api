import { UserResponseDto } from './user-response.dto'

export class LoginResponseDto {
	accessToken: string
	exp: number
	user: UserResponseDto
}
