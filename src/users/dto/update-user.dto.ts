import { PartialType } from '@nestjs/swagger'
import { CreateUserDto, CreateUserWithProfileDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserWithProfileDto extends PartialType(
	CreateUserWithProfileDto
) {}
