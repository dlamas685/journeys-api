import { ApiProperty } from '@nestjs/swagger'
import { RouteEntity } from './route.entity'

export class AdvancedOptimizationEntity {
	@ApiProperty({ type: [RouteEntity] })
	routes: RouteEntity[]

	constructor(partial: Partial<AdvancedOptimizationEntity>) {
		Object.assign(this, partial)
	}
}
