import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from 'src/common/dto'
import { VehicleEntity } from '../entities/vehicle.entity'

type ValidFieldsType = keyof VehicleEntity

const VALID_FIELDS: ValidFieldsType[] = [
	'make',
	'model',
	'vin',
	'year',
	'licensePlate',
	'createdAt',
]

export class VehicleFilterFieldDto extends FilterFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class VehicleSortFieldDto extends SortFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class VehicleLogicalFilterDto extends LogicalFilterDto {
	@Transform(({ value }) => plainToInstance(VehicleFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => VehicleFilterFieldDto)
	conditions: VehicleFilterFieldDto[]
}

export class VehicleQueryParamsDto extends QueryParamsDto {
	@Transform(({ value }) => plainToInstance(VehicleFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => VehicleFilterFieldDto)
	filters?: VehicleFilterFieldDto[]

	@Transform(({ value }) => plainToInstance(VehicleSortFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => VehicleSortFieldDto)
	sorts?: VehicleSortFieldDto[]

	@Transform(({ value }) => plainToInstance(VehicleLogicalFilterDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => VehicleLogicalFilterDto)
	logicalFilters?: VehicleLogicalFilterDto[]
}
