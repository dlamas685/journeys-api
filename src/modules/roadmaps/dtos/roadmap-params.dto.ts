import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from '../../../common/dtos'
import { RoadmapEntity } from '../entities/roadmap.entity'

type ValidFieldsType = keyof RoadmapEntity

const VALID_FIELDS: ValidFieldsType[] = ['code', 'status', 'createdAt']

export class RoadmapFilterFieldDto extends FilterFieldDto {
	@IsIn([...VALID_FIELDS])
	field: string
}

export class RoadmapSortFieldDto extends SortFieldDto {
	@IsIn([...VALID_FIELDS])
	field: string
}

export class RoadmapLogicalFilterDto extends LogicalFilterDto {
	@Transform(({ value }) => plainToInstance(RoadmapFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => RoadmapFilterFieldDto)
	conditions: RoadmapFilterFieldDto[]
}

export class RoadmapQueryParamsDto extends QueryParamsDto {
	@Transform(({ value }) => plainToInstance(RoadmapFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => RoadmapFilterFieldDto)
	filters?: RoadmapFilterFieldDto[]

	@Transform(({ value }) => plainToInstance(RoadmapSortFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => RoadmapSortFieldDto)
	sorts?: RoadmapSortFieldDto[]

	@Transform(({ value }) => plainToInstance(RoadmapLogicalFilterDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => RoadmapLogicalFilterDto)
	logicalFilters?: RoadmapLogicalFilterDto[]
}
