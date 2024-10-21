import { plainToClass, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from 'src/common/dto'

const VALID_FIELDS = ['address', 'alias']

export class FavoriteAddressFilterFieldDto extends FilterFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class FavoriteAddressSortFieldDto extends SortFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class FavoriteAddressLogicalFilterDto extends LogicalFilterDto {
	@Transform(
		({ value }) => plainToClass(FavoriteAddressFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => FavoriteAddressFilterFieldDto)
	conditions: FavoriteAddressFilterFieldDto[]
}

export class FavoriteAddressQueryParamsDto extends QueryParamsDto {
	@Transform(
		({ value }) => plainToClass(FavoriteAddressFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => FavoriteAddressFilterFieldDto)
	filters?: FavoriteAddressFilterFieldDto[]

	@Transform(({ value }) => plainToClass(FavoriteAddressSortFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => FavoriteAddressSortFieldDto)
	sorts?: FavoriteAddressSortFieldDto[]

	@Transform(
		({ value }) => plainToClass(FavoriteAddressLogicalFilterDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => FavoriteAddressLogicalFilterDto)
	logicalFilters?: FavoriteAddressLogicalFilterDto[]
}
