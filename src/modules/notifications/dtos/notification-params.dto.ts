import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from '../../../common/dtos'
import { NotificationEntity } from '../entities/notification.entity'

type ValidFieldsType = keyof NotificationEntity

const VALID_FIELDS: ValidFieldsType[] = [
	'recipientId',
	'type',
	'readAt',
	'createdAt',
]

export class NotificationFilterFieldDto extends FilterFieldDto {
	@IsIn([...VALID_FIELDS])
	field: string
}

export class NotificationSortFieldDto extends SortFieldDto {
	@IsIn([...VALID_FIELDS])
	field: string
}

export class NotificationLogicalFilterDto extends LogicalFilterDto {
	@Transform(
		({ value }) => plainToInstance(NotificationFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => NotificationFilterFieldDto)
	conditions: NotificationFilterFieldDto[]
}

export class NotificationQueryParamsDto extends QueryParamsDto {
	@Transform(
		({ value }) => plainToInstance(NotificationFilterFieldDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => NotificationFilterFieldDto)
	filters?: NotificationFilterFieldDto[]

	@Transform(({ value }) => plainToInstance(NotificationSortFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => NotificationSortFieldDto)
	sorts?: NotificationSortFieldDto[]

	@Transform(
		({ value }) => plainToInstance(NotificationLogicalFilterDto, value),
		{
			toClassOnly: true,
		}
	)
	@ValidateNested({ each: true })
	@Type(() => NotificationLogicalFilterDto)
	logicalFilters?: NotificationLogicalFilterDto[]
}
