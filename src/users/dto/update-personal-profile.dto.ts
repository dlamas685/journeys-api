import { PartialType } from '@nestjs/mapped-types'
import { CreatePersonalProfileDto } from './create-personal-profile.dto'

export class UpdatePersonalProfileDto extends PartialType(
	CreatePersonalProfileDto
) {}
