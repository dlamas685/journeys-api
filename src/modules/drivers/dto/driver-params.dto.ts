import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from 'src/common/dto'
import { DriverEntity } from '../entities/driver.entity'

type ValidFieldsType = keyof DriverEntity

const VALID_FIELDS: ValidFieldsType[] = [
	'licenseNumber',
	'name',
	'fleetId',
	'createdAt',
]

export class DriverFilterFieldDto extends FilterFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class DriverSortFieldDto extends SortFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class DriverLogicalFilterDto extends LogicalFilterDto {
	@Transform(({ value }) => plainToInstance(DriverFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => DriverFilterFieldDto)
	conditions: DriverFilterFieldDto[]
}

export class DriverQueryParamsDto extends QueryParamsDto {
	@Transform(({ value }) => plainToInstance(DriverFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => DriverFilterFieldDto)
	filters?: DriverFilterFieldDto[]

	@Transform(({ value }) => plainToInstance(DriverSortFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => DriverSortFieldDto)
	sorts?: DriverSortFieldDto[]

	@Transform(({ value }) => plainToInstance(DriverLogicalFilterDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => DriverLogicalFilterDto)
	logicalFilters?: DriverLogicalFilterDto[]
}
