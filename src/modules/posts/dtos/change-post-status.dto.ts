import { ApiProperty } from '@nestjs/swagger'
import { PostStatus } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator'

export class ChangePostStatusDto {
	@IsNotEmpty()
	@IsUUID()
	@ApiProperty({ example: '9d8f5715-2e7c-4e64-8e34-35f510c12e66' })
	id: string

	@IsEnum(PostStatus)
	@ApiProperty({
		enum: PostStatus,
		example: Object.keys(PostStatus).join(' | '),
	})
	postStatus: PostStatus
}
