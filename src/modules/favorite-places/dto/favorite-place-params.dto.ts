import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from 'src/common/dto'
import { FavoritePlaceEntity } from '../entities/favorite-place.entity'

type ValidFieldsType = keyof FavoritePlaceEntity

const VALID_FIELDS: ValidFieldsType[] = ['createdAt', 'name', 'address']

export class FavoritePlaceFilterFieldDto extends FilterFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class FavoritePlaceSortFieldDto extends SortFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class FavoritePlaceLogicalFilterDto extends LogicalFilterDto {
	@Transform(
		({ value }) => plainToInstance(FavoritePlaceFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => FavoritePlaceFilterFieldDto)
	conditions: FavoritePlaceFilterFieldDto[]
}

export class FavoritePlaceQueryParamsDto extends QueryParamsDto {
	@Transform(
		({ value }) => plainToInstance(FavoritePlaceFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => FavoritePlaceFilterFieldDto)
	filters?: FavoritePlaceFilterFieldDto[]

	@Transform(({ value }) => plainToInstance(FavoritePlaceSortFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => FavoritePlaceSortFieldDto)
	sorts?: FavoritePlaceSortFieldDto[]

	@Transform(
		({ value }) => plainToInstance(FavoritePlaceLogicalFilterDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => FavoritePlaceLogicalFilterDto)
	logicalFilters?: FavoritePlaceLogicalFilterDto[]
}
