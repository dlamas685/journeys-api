import { plainToInstance, Transform, Type } from 'class-transformer'
import { IsIn, ValidateNested } from 'class-validator'
import {
	FilterFieldDto,
	LogicalFilterDto,
	QueryParamsDto,
	SortFieldDto,
} from '../../../common/dto'
import { PostEntity } from '../entities/post.entity'

type ValidFieldsType = keyof PostEntity

const VALID_FIELDS: ValidFieldsType[] = [
	'postStatus',
	'cityTown',
	'carrierName',
	'createdAt',
]

export class PostFilterFieldDto extends FilterFieldDto {
	@IsIn([...VALID_FIELDS])
	field: string
}

export class PostSortFieldDto extends SortFieldDto {
	@IsIn([...VALID_FIELDS])
	field: string
}

export class PostLogicalFilterDto extends LogicalFilterDto {
	@Transform(({ value }) => plainToInstance(PostFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => PostFilterFieldDto)
	conditions: PostFilterFieldDto[]
}

export class PostQueryParamsDto extends QueryParamsDto {
	@Transform(({ value }) => plainToInstance(PostFilterFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => PostFilterFieldDto)
	filters?: PostFilterFieldDto[]

	@Transform(({ value }) => plainToInstance(PostSortFieldDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => PostSortFieldDto)
	sorts?: PostSortFieldDto[]

	@Transform(({ value }) => plainToInstance(PostLogicalFilterDto, value), {
		toClassOnly: true,
	})
	@ValidateNested({ each: true })
	@Type(() => PostLogicalFilterDto)
	logicalFilters?: PostLogicalFilterDto[]
}
