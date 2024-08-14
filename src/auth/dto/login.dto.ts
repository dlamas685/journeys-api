import { ApiProperty } from '@nestjs/swagger'
import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator'

export class LoginDto {
	@ApiProperty({
		description: 'Correo electrónico del usuario',
		example: 'example@example.com',
		format: 'email',
		nullable: false,
	})
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@ApiProperty({
		description: 'Contraseña del usuario',
		example: 'Hola1234?',
		nullable: false,
		pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
	})
	@IsString()
	@IsNotEmpty()
	password: string

	@ApiProperty({
		description: 'Recordar sesión del usuario',
		example: false,
		default: false,
	})
	@IsBoolean()
	@IsOptional()
	rememberMe?: boolean = false
}
