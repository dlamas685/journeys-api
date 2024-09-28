import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { CreateUserDto } from './create-user.dto'
import { UpdateCompanyProfileDto } from './update-company-profile.dto'
import { UpdatePersonalProfileDto } from './update-personal-profile.dto'

export class UpdateUserDto extends PartialType(
	OmitType(CreateUserDto, ['companyProfile', 'personalProfile'])
) {
	@ValidateNested()
	@Type(() => UpdateCompanyProfileDto)
	@ApiProperty()
	companyProfile?: UpdateCompanyProfileDto

	@ValidateNested()
	@Type(() => UpdatePersonalProfileDto)
	@ApiProperty()
	personalProfile?: UpdatePersonalProfileDto
}
