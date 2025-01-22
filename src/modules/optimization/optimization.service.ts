import { Injectable } from '@nestjs/common'
import { RouteOptimizationService } from '../google-maps/services/route-optimization.service'
import { RoutesService } from '../google-maps/services/routes.service'
import { toGoogleTimestamp } from './helpers'
import { ShipmentModelDto } from './routes-optimization/dto'
import { AdvancedCriteriaDto, BasicCriteriaDto } from './routes/dto'
import {
	AdvancedOptimizationEntity,
	BasicOptimizationEntity,
	RouteEntityBuilder,
} from './routes/entities'
import { RoutingPreference } from './routes/enums'

@Injectable()
export class OptimizationService {
	constructor(
		private readonly routes: RoutesService,
		private readonly routesOptimization: RouteOptimizationService
	) {}

	async computeBasicOptimization(basicCriteriaDto: BasicCriteriaDto) {
		const { origin, destination, intermediates, ...rest } = basicCriteriaDto

		const computed = await this.routes.computeBasicRoute({
			...basicCriteriaDto,
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
					? toGoogleTimestamp(rest.departure.date, rest.departure.time)
					: undefined,
		})

		const defaultRoute = computed.routes.at(0)

		const route = new RouteEntityBuilder()
			.setDistance(defaultRoute.distanceMeters)
			.setDuration(defaultRoute.duration, defaultRoute.staticDuration)
			.setPolyline(defaultRoute.polyline.encodedPolyline)
			.setLocalizedValues(defaultRoute.localizedValues)
			.setPassages(intermediates)
			.build()

		const optimization = new BasicOptimizationEntity({ route })

		return optimization
	}

	async computeAdvancedOptimization(advancedCriteriaDto: AdvancedCriteriaDto) {
		const { origin, destination, intermediates, ...rest } = advancedCriteriaDto

		const computed = await this.routes.computeAdvancedRoute({
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
					? toGoogleTimestamp(rest.departure.date, rest.departure.time)
					: undefined,
		})

		const routes = computed.routes.map(route => {
			const routeBuilder = new RouteEntityBuilder()
				.setDistance(route.distanceMeters)
				.setDuration(route.duration, route.staticDuration)
				.setPolyline(route.polyline.encodedPolyline)
				.setLabels(route.routeLabels)
				.setTravelAdvisory(route.travelAdvisory)
				.setLocalizedValues(route.localizedValues)
				.setLegs(route.legs)

			if (intermediates && intermediates.length > 0) {
				routeBuilder.setStops(intermediates)
				routeBuilder.setPassages(intermediates)
			}

			return routeBuilder.build()
		})

		const optimization = new AdvancedOptimizationEntity({ routes })

		return optimization
	}

	async optimizeTours(shipmentModelDto: ShipmentModelDto) {
		const computed = await this.routesOptimization.optimizeTours({
			model: shipmentModelDto,
		})

		return computed
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
