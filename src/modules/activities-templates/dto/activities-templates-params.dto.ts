import { plainToClass, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from '../../../common/dto'

const VALID_FIELDS = ['name', 'createdAt']

export class ActivitiesTemplatesFilterFieldDto extends FilterFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class ActivitiesTemplatesSortFieldDto extends SortFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class ActivitiesTemplatesLogicalFilterDto extends LogicalFilterDto {
	@Transform(
		({ value }) => plainToClass(ActivitiesTemplatesFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => ActivitiesTemplatesFilterFieldDto)
	conditions: ActivitiesTemplatesFilterFieldDto[]
}

export class ActivitiesTemplatesQueryParamsDto extends QueryParamsDto {
	@Transform(
		({ value }) => plainToClass(ActivitiesTemplatesFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => ActivitiesTemplatesFilterFieldDto)
	filters?: ActivitiesTemplatesFilterFieldDto[]

	@Transform(
		({ value }) => plainToClass(ActivitiesTemplatesSortFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => ActivitiesTemplatesSortFieldDto)
	sorts?: ActivitiesTemplatesSortFieldDto[]

	@Transform(
		({ value }) => plainToClass(ActivitiesTemplatesLogicalFilterDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => ActivitiesTemplatesLogicalFilterDto)
	logicalFilters?: ActivitiesTemplatesLogicalFilterDto[]
}
