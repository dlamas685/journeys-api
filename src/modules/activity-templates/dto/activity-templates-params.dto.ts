import { plainToClass, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from '../../../common/dto'
import { ActivityTemplateEntity } from '../entities/activity-template.entity'

type ValidFieldsType = keyof ActivityTemplateEntity

const VALID_FIELDS: ValidFieldsType[] = ['name', 'description', 'createdAt']

export class ActivityTemplatesFilterFieldDto extends FilterFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class ActivityTemplatesSortFieldDto extends SortFieldDto {
	@IsIn(VALID_FIELDS)
	field: string
}

export class ActivityTemplatesLogicalFilterDto extends LogicalFilterDto {
	@Transform(
		({ value }) => plainToClass(ActivityTemplatesFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => ActivityTemplatesFilterFieldDto)
	conditions: ActivityTemplatesFilterFieldDto[]
}

export class ActivityTemplatesQueryParamsDto extends QueryParamsDto {
	@Transform(
		({ value }) => plainToClass(ActivityTemplatesFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => ActivityTemplatesFilterFieldDto)
	filters?: ActivityTemplatesFilterFieldDto[]

	@Transform(
		({ value }) => plainToClass(ActivityTemplatesSortFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => ActivityTemplatesSortFieldDto)
	sorts?: ActivityTemplatesSortFieldDto[]

	@Transform(
		({ value }) => plainToClass(ActivityTemplatesLogicalFilterDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => ActivityTemplatesLogicalFilterDto)
	logicalFilters?: ActivityTemplatesLogicalFilterDto[]
}
