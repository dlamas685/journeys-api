import { Injectable, NotFoundException } from '@nestjs/common'
import { PostStatus, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { plainToInstance } from 'class-transformer'
import {
	PaginatedResponseEntity,
	PaginationMetadataEntity,
} from 'src/common/entities/paginated-response.entity'
import {
	fromFiltersToWhere,
	fromLogicalFiltersToWhere,
	fromSortsToOrderby,
} from 'src/common/helpers'
import { PrismaService } from '../prisma/prisma.service'
import { ChangePostStatusDto, PostQueryParamsDto } from './dto'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostEntity } from './entities/post.entity'

@Injectable()
export class PostsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		userId: string,
		createPostDto: CreatePostDto
	): Promise<PostEntity> {
		const newPost = await this.prisma.post.create({
			data: {
				userId,
				...createPostDto,
				pricePerKg: new Decimal(createPostDto.pricePerKg),
				pricePerPostal: new Decimal(createPostDto.pricePerPostal),
			},
		})

		return new PostEntity(newPost)
	}

	async findAll(
		userId: string,
		queryParamsDto: PostQueryParamsDto
	): Promise<PaginatedResponseEntity<PostEntity>> {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.PostFindManyArgs = {
			where: {
				userId,
				...parsedFilters,
				...parsedLogicalFilters,
			},
			orderBy: {
				...parsedSorts,
			},
			skip:
				queryParamsDto.page && queryParamsDto.limit
					? (queryParamsDto.page - 1) * queryParamsDto.limit
					: undefined,
			take: queryParamsDto.limit,
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.post.findMany(query),
			this.prisma.post.count({ where: query.where }),
		])

		const posts = records.map(record => new PostEntity(record))

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return new PaginatedResponseEntity<PostEntity>(posts, metadata)
	}

	async showAll(
		queryParamsDto: PostQueryParamsDto
	): Promise<PaginatedResponseEntity<PostEntity>> {
		const parsedFilters = fromFiltersToWhere(queryParamsDto.filters)

		const parsedLogicalFilters = fromLogicalFiltersToWhere(
			queryParamsDto.logicalFilters
		)

		const parsedSorts = fromSortsToOrderby(queryParamsDto.sorts)

		const query: Prisma.PostFindManyArgs = {
			where: {
				...parsedFilters,
				...parsedLogicalFilters,
				isPublic: true,
				postStatus: PostStatus.AVAILABLE,
				trips: {
					is: {
						isArchived: false,
					},
				},
			},
			orderBy: {
				...parsedSorts,
			},
			skip:
				queryParamsDto.page && queryParamsDto.limit
					? (queryParamsDto.page - 1) * queryParamsDto.limit
					: undefined,
			take: queryParamsDto.limit,
		}

		const [records, totalPages] = await this.prisma.$transaction([
			this.prisma.post.findMany(query),
			this.prisma.post.count({ where: query.where }),
		])

		const posts = records.map(record => new PostEntity(record))

		const metadata = plainToInstance(PaginationMetadataEntity, {
			total: totalPages,
			page: queryParamsDto.page,
			lastPage: Math.ceil(totalPages / queryParamsDto.limit),
		})

		return new PaginatedResponseEntity<PostEntity>(posts, metadata)
	}

	async findOne(userId: string, id: string) {
		const foundPost = await this.prisma.post.findFirst({
			where: {
				id,
				userId,
			},
		})

		if (!foundPost) {
			throw new NotFoundException('Viaje no encontrado')
		}

		return new PostEntity(foundPost)
	}

	async update(
		userId: string,
		id: string,
		updatePostDto: UpdatePostDto
	): Promise<PostEntity> {
		const updatedPost = await this.prisma.post.update({
			where: {
				userId,
				id,
			},
			data: {
				...updatePostDto,
				pricePerKg: updatePostDto.pricePerPostal
					? new Decimal(updatePostDto.pricePerKg)
					: null,
				pricePerPostal: updatePostDto.pricePerPostal
					? new Decimal(updatePostDto.pricePerPostal)
					: undefined,
			},
		})

		return new PostEntity(updatedPost)
	}

	async remove(userId: string, id: string) {
		await this.prisma.trip.delete({
			where: {
				userId,
				id,
			},
		})

		return `Eliminación completa!`
	}

	async changeStatus(
		userId: string,
		changePostStatusDto: ChangePostStatusDto
	): Promise<PostEntity> {
		const changedTripStatus = await this.prisma.post.update({
			where: {
				userId,
				id: changePostStatusDto.id,
			},
			data: {
				postStatus: changePostStatusDto.postStatus,
			},
		})

		return new PostEntity(changedTripStatus)
	}
}
