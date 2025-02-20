import { applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { PaginatedResponseEntity, PaginationMetadataEntity } from '../entities'

export const ApiOkResponsePaginated = <Entity extends Type<unknown>>(
	entity: Entity
) =>
	applyDecorators(
		ApiExtraModels(PaginatedResponseEntity, PaginationMetadataEntity, entity),
		ApiOkResponse({
			schema: {
				allOf: [
					{ $ref: getSchemaPath(PaginatedResponseEntity) },
					{
						properties: {
							data: {
								type: 'array',
								items: { $ref: getSchemaPath(entity) },
							},
						},
					},
				],
			},
		})
	)
