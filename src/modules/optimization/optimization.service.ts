import { Injectable } from '@nestjs/common'
import { RoutesService } from '../google-maps/services/routes.service'
import { BasicCriteriaDto } from './dto'
import { BasicOptimizationEntity } from './entities'
import { RoutingPreference } from './enums'
import { toTimestamp } from './helpers'

@Injectable()
export class OptimizationService {
	constructor(private readonly routes: RoutesService) {}

	async computeBasicOptimization(basicCriteriaDto: BasicCriteriaDto) {
		const { routes } = await this.routes.optimizeRoute({
			...basicCriteriaDto,
			departureTime:
				basicCriteriaDto.routingPreference !==
					RoutingPreference.TRAFFIC_UNAWARE &&
				basicCriteriaDto.routingPreference !==
					RoutingPreference.ROUTING_PREFERENCE_UNSPECIFIED
					? toTimestamp(
							basicCriteriaDto.departure.date,
							basicCriteriaDto.departure.time
						)
					: undefined,
		})

		const defaultRoute = routes[0]

		const optimization = new BasicOptimizationEntity({
			distance: defaultRoute.localizedValues.distance.text,
			duration: defaultRoute.localizedValues.duration.text,
			encodedPolyline: defaultRoute.polyline.encodedPolyline,
		})

		return optimization
	}

	async computeAdvancedOptimization() {
		return 'Advanced optimization'
	}
}
