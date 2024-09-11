import { PartialType } from '@nestjs/swagger'
import { CreatePersonalProfileDto } from './create-personal-profile.dto'

export class UpdatePersonalProfileDto extends PartialType(
	CreatePersonalProfileDto
) {}
