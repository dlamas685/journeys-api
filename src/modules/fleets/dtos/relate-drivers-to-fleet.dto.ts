import { ApiProperty } from '@nestjs/swagger'
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsUUID,
} from 'class-validator'
import { RelationOperations } from '../enums/relation-operations.enum'

export class RelateDriversToFleetDto {
	@ApiProperty({
		description: 'Lista de IDs de conductores a enlazar',
		example: [
			'c7b9c2b2-9c5d-4b6c-9f6b-1c9f4c3e0c4d',
			'c7b9c2b2-9c5d-4b6c-9f6b-1c9f4c3e0c4d',
			'c7b9c2b2-9c5d-4b6c-9f6b-1c9f4c3e0c4d',
		],
	})
	@IsArray()
	@IsUUID('4', { each: true })
	@IsNotEmpty()
	driverIds: string[]

	@ApiProperty({
		description: 'Operación a realizar',
		example: RelationOperations.LINK,
	})
	@IsEnum(RelationOperations)
	@IsOptional()
	operation: RelationOperations = RelationOperations.LINK
}
