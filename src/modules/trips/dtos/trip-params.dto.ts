import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from '../../../common/dtos'
import { TripEntity } from '../entities/trip.entity'

type ValidFieldsType = keyof TripEntity

const VALID_FIELDS: ValidFieldsType[] = [
	'code',
	'origin',
	'destination',
	'isArchived',
	'departureTime',
	'createdAt',
]

export class TripFilterFieldDto extends FilterFieldDto {
	@IsIn([...VALID_FIELDS])
	field: string
}

export class TripSortFieldDto extends SortFieldDto {
	@IsIn([...VALID_FIELDS])
	field: string
}

export class TripLogicalFilterDto extends LogicalFilterDto {
	@Transform(({ value }) => plainToInstance(TripFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => TripFilterFieldDto)
	conditions: TripFilterFieldDto[]
}

export class TripQueryParamsDto extends QueryParamsDto {
	@Transform(({ value }) => plainToInstance(TripFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => TripFilterFieldDto)
	filters?: TripFilterFieldDto[]

	@Transform(({ value }) => plainToInstance(TripSortFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => TripSortFieldDto)
	sorts?: TripSortFieldDto[]

	@Transform(({ value }) => plainToInstance(TripLogicalFilterDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => TripLogicalFilterDto)
	logicalFilters?: TripLogicalFilterDto[]
}
