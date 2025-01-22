import { ApiProperty } from '@nestjs/swagger'
import { RouteEntity } from './route.entity'

export class BasicOptimizationEntity {
	@ApiProperty({ type: RouteEntity })
	route: RouteEntity

	constructor(partial: Partial<BasicOptimizationEntity>) {
		Object.assign(this, partial)
	}
}
