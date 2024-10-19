import { plainToClass, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from 'src/common/dto'

const VALID_FIELDS = ['address', 'alias']

export class FavoriteAddressesFilterFieldDto extends FilterFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class FavoriteAddressesSortFieldDto extends SortFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class FavoriteAddressesLogicalFilterDto extends LogicalFilterDto {
	@Transform(
		({ value }) => plainToClass(FavoriteAddressesFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => FavoriteAddressesFilterFieldDto)
	conditions: FavoriteAddressesFilterFieldDto[]
}

export class FavoriteAddressesQueryParamsDto extends QueryParamsDto {
	@Transform(
		({ value }) => plainToClass(FavoriteAddressesFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => FavoriteAddressesFilterFieldDto)
	filters?: FavoriteAddressesFilterFieldDto[]

	@Transform(
		({ value }) => plainToClass(FavoriteAddressesSortFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => FavoriteAddressesSortFieldDto)
	sorts?: FavoriteAddressesSortFieldDto[]

	@Transform(
		({ value }) => plainToClass(FavoriteAddressesLogicalFilterDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => FavoriteAddressesLogicalFilterDto)
	logicalFilters?: FavoriteAddressesLogicalFilterDto[]
}
