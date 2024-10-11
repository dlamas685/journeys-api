import { plainToClass, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from 'src/common/dto'

const VALID_FIELDS = ['id', 'email', 'userType', 'personalProfile.firstName']

export class UsersFilterFieldDto extends FilterFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class UsersSortFieldDto extends SortFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class UsersLogicalFilterDto extends LogicalFilterDto {
	@Transform(({ value }) => plainToClass(UsersFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => UsersFilterFieldDto)
	conditions: UsersFilterFieldDto[]
}

export class UsersQueryParamsDto extends QueryParamsDto {
	@Transform(({ value }) => plainToClass(UsersFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => UsersFilterFieldDto)
	filters?: UsersFilterFieldDto[]

	@Transform(({ value }) => plainToClass(UsersSortFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => UsersSortFieldDto)
	sorts?: UsersSortFieldDto[]

	@Transform(({ value }) => plainToClass(UsersLogicalFilterDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => UsersLogicalFilterDto)
	logicalFilters?: UsersLogicalFilterDto[]
}
