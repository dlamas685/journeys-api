import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from 'src/common/dtos'
import { FleetEntity } from '../entities/fleet.entity'

type ValidFieldsType = keyof FleetEntity

const VALID_FIELDS: ValidFieldsType[] = [
	'name',
	'description',
	'maxDrivers',
	'maxVehicles',
	'createdAt',
]

export class FleetFilterFieldDto extends FilterFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class FleetSortFieldDto extends SortFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class FleetLogicalFilterDto extends LogicalFilterDto {
	@Transform(({ value }) => plainToInstance(FleetFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => FleetFilterFieldDto)
	conditions: FleetFilterFieldDto[]
}

export class FleetQueryParamsDto extends QueryParamsDto {
	@Transform(({ value }) => plainToInstance(FleetFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => FleetFilterFieldDto)
	filters?: FleetFilterFieldDto[]

	@Transform(({ value }) => plainToInstance(FleetSortFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => FleetSortFieldDto)
	sorts?: FleetSortFieldDto[]

	@Transform(({ value }) => plainToInstance(FleetLogicalFilterDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => FleetLogicalFilterDto)
	logicalFilters?: FleetLogicalFilterDto[]
}
