import { Injectable } from '@nestjs/common'
import { RoutesService } from '../google-maps/services/routes.service'
import { AdvancedCriteriaDto, BasicCriteriaDto } from './dto'
import { BasicOptimizationEntity } from './entities'
import { RoutingPreference } from './enums'
import { toTimestamp } from './helpers'

@Injectable()
export class OptimizationService {
	constructor(private readonly routes: RoutesService) {}

	async computeBasicOptimization(basicCriteriaDto: BasicCriteriaDto) {
		const { origin, destination } = basicCriteriaDto

		const { routes } = await this.routes.computeBasicRoute({
			...basicCriteriaDto,
			origin: {
				placeId: origin.placeId,
				sideOfRoad: origin.sideOfRoad,
			},
			destination: {
				placeId: destination.placeId,
				sideOfRoad: destination.sideOfRoad,
			},
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

	async computeAdvancedOptimization(advancedCriteriaDto: AdvancedCriteriaDto) {
		const { intermediates, ...rest } = advancedCriteriaDto

		const computed = await this.routes.computeAdvancedRoute({
			...rest,
			origin: {
				placeId: rest.origin.placeId,
				sideOfRoad: rest.origin.sideOfRoad,
			},
			destination: {
				placeId: rest.destination.placeId,
				sideOfRoad: rest.destination.sideOfRoad,
			},
			intermediates: intermediates.map(({ placeId, vehicleStopover, via }) => ({
				placeId,
				vehicleStopover,
				via,
			})),
			departureTime:
				rest.routingPreference !== RoutingPreference.TRAFFIC_UNAWARE &&
				rest.routingPreference !==
					RoutingPreference.ROUTING_PREFERENCE_UNSPECIFIED
					? toTimestamp(rest.departure.date, rest.departure.time)
					: undefined,
		})

		const totalDuration = intermediates.map(({ activities }) =>
			activities.reduce((acc, { duration }) => acc + duration, 0)
		)

		return { computed, totalDuration }
	}
}
