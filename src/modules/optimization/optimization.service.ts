import { Injectable } from '@nestjs/common'
import { RoutesService } from '../google-maps/services/routes.service'
import { AdvancedCriteriaDto, BasicCriteriaDto } from './dto'
import {
	BasicOptimizationEntity,
	RouteEntity,
	RouteEntityBuilder,
} from './entities'
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
		const { origin, destination, intermediates, ...rest } = advancedCriteriaDto

		const { routes } = await this.routes.computeAdvancedRoute({
			...rest,
			origin: {
				placeId: origin.placeId,
				sideOfRoad: origin.sideOfRoad,
			},
			destination: {
				placeId: destination.placeId,
				sideOfRoad: destination.sideOfRoad,
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

		if (routes.length === 1) {
			const computedDuration = intermediates.map(({ activities }) => ({
				totalDuration: activities.reduce(
					(acc, { duration }) => acc + duration,
					0
				),
			}))

			const route = routes[0]

			const optimization: RouteEntity = new RouteEntityBuilder()
				.setDistance(route.distanceMeters)
				.setDuration(route.duration, route.staticDuration)
				.setPolyline(route.polyline.encodedPolyline)
				.setLabels(route.routeLabels)
				.setTravelAdvisory(route.travelAdvisory)
				.setLocalizedValues(route.localizedValues)
				.setLegs(route.legs)
				.build()

			return optimization
		}

		return { routes }
	}
}

/*
 
	Mi respuesta puede tener un array de rutas o una sola ruta.
	Mi respuesta debe incluir la distancia total que demora la ruta y la duración total de la ruta.
	Mi respuesta puede incluir distancia y duración para cada tramo de la ruta.
	Mi respuesta debe incluir una polilínea codificada de la ruta completa.
	Mi respuesta puede incluir una polilínea codificada para cada tramo de la ruta.

	Una ruta generara un tramo si tiene al menos un punto intermedio que sea una parada.

	Los puntos intermedios de paso no generan tramo.

	La duración en un punto intermedio es la suma de las duraciones de las actividades que lo componen. (waypointDuration)

	La duración de un tramo es lo que se tarda en ir de un punto de referencia a otro. (legDuration)

	La duración total de la ruta es la suma de las duraciones de los tramos + la duración de las actividades de los puntos intermedios que son paradas. (totalDuration)

	La distancia de un tramo es la distancia de un punto a otro. (legDistance)

	La distancia total de la ruta es la suma de las distancias de los tramos. (totalDistance)


 */
