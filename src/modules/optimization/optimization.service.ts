import { TZDate } from '@date-fns/tz'
import { Injectable, NotFoundException } from '@nestjs/common'

import { TIME_ZONES } from 'src/common/constants'
import { DriversService } from '../drivers/drivers.service'
import { FleetsService } from '../fleets/fleets.service'
import { PlacesService } from '../google-maps/services/places.service'
import { RouteOptimizationService } from '../google-maps/services/route-optimization.service'
import { RoutesService } from '../google-maps/services/routes.service'
import { VehiclesService } from '../vehicles/vehicles.service'
import { FleetManagementBuilder, TravelPlanningBuilder } from './classes'
import { isNearby, isPlaceOpenAtTime } from './helpers'
import { COST_PROFILES } from './routes-optimization/constants/cost-profiles.constant'
import { SettingDto } from './routes-optimization/dtos'
import { RoadmapOptimizationBuilderEntity } from './routes-optimization/entities'
import { CostProfile } from './routes-optimization/enums/cost-profile.enum'
import { BasicCriteriaDto, CriteriaDto } from './routes/dtos'
import {
	LegEntityBuilder,
	PassageEntityBuilder,
	RouteEntityBuilder,
	StepEntityBuilder,
	StopEntity,
	StopEntityBuilder,
} from './routes/entities'
import { Maneuver, Speed } from './routes/enums'

@Injectable()
export class OptimizationService {
	constructor(
		private readonly routes: RoutesService,
		private readonly routesOptimization: RouteOptimizationService,
		private readonly fleets: FleetsService,
		private readonly drivers: DriversService,
		private readonly vehicles: VehiclesService,
		private readonly places: PlacesService
	) {}

	async computeBasicOptimization(basicCriteria: BasicCriteriaDto) {
		const request = new TravelPlanningBuilder()
			.setOrigin(basicCriteria.origin)
			.setDestination(basicCriteria.destination)
			.setDepartureTime(basicCriteria.departureTime)
			.setTravelMode(basicCriteria.travelMode)
			.setTrafficOption(basicCriteria.trafficOption)

		if (basicCriteria.interestPoints) {
			request.setInterestPoints(basicCriteria.interestPoints)
		}

		if (basicCriteria.modifiers) {
			request.setModifiers(basicCriteria.modifiers)
		}

		const build = request.build()

		const response = await this.routes.computeBasicRoute(build)

		const optimization = response.routes.map(route =>
			new RouteEntityBuilder()
				.setDistance(route.distanceMeters)
				.setDuration(
					Number(route.duration.seconds),
					Number(route.staticDuration.seconds)
				)
				.setPolyline(route.polyline.encodedPolyline)
				.setLocalizedValues({
					distance: route.localizedValues.distance.text,
					duration: route.localizedValues.duration.text,
					staticDuration: route.localizedValues.staticDuration.text,
				})
				.setPassages(basicCriteria.interestPoints)
				.build()
		)

		return optimization
	}

	async computeAdvancedOptimization(criteriaDto: CriteriaDto) {
		const request = new TravelPlanningBuilder()
			.setOrigin(criteriaDto.basicCriteria.origin)
			.setDestination(criteriaDto.basicCriteria.destination)
			.setTravelMode(criteriaDto.basicCriteria.travelMode)
			.setDepartureTime(criteriaDto.basicCriteria.departureTime)
			.setTrafficOption(criteriaDto.basicCriteria.trafficOption)

		if (criteriaDto.basicCriteria.modifiers) {
			request.setModifiers(criteriaDto.basicCriteria.modifiers)
		}

		if (
			criteriaDto.advancedCriteria &&
			criteriaDto.advancedCriteria.interestPoints
		) {
			request.setInterestPoints(criteriaDto.advancedCriteria.interestPoints)
		}

		if (
			criteriaDto.advancedCriteria &&
			criteriaDto.advancedCriteria.computeAlternativeRoutes
		) {
			request.setComputeAlternativeRoutes(
				criteriaDto.advancedCriteria.computeAlternativeRoutes
			)
		}

		if (
			criteriaDto.advancedCriteria &&
			criteriaDto.advancedCriteria.trafficModel
		) {
			request.setTrafficModel(criteriaDto.advancedCriteria.trafficModel)
		}

		if (
			criteriaDto.advancedCriteria &&
			criteriaDto.advancedCriteria.requestedReferenceRoutes
		) {
			request.setRequestedReferenceRoutes(
				criteriaDto.advancedCriteria.requestedReferenceRoutes
			)
		}

		if (
			criteriaDto.advancedCriteria &&
			criteriaDto.advancedCriteria.extraComputations
		) {
			request.setExtraComputations(
				criteriaDto.advancedCriteria.extraComputations
			)
		}

		if (
			criteriaDto.advancedCriteria &&
			criteriaDto.advancedCriteria.optimizeWaypointOrder
		) {
			request.setOptimizeWaypointOrder(
				criteriaDto.advancedCriteria.optimizeWaypointOrder
			)
		}

		const build = request.build()

		const response = await this.routes.computeAdvancedRoute(build)

		const optimization = response.routes.map(route => {
			const routeBuilder = new RouteEntityBuilder()
				.setDistance(route.distanceMeters)
				.setDuration(
					Number(route.duration.seconds),
					Number(route.staticDuration.seconds)
				)
				.setPolyline(route.polyline.encodedPolyline)
				.setLabels(route.routeLabels)
				.setLocalizedValues({
					distance: route.localizedValues.distance.text,
					duration: route.localizedValues.duration.text,
					staticDuration: route.localizedValues.staticDuration.text,
				})

			if (route.travelAdvisory) {
				routeBuilder.setTravelAdvisory({
					routeRestrictionsPartiallyIgnored:
						route.travelAdvisory.routeRestrictionsPartiallyIgnored,
					speedReadingIntervals:
						route.travelAdvisory.speedReadingIntervals?.map(interval => ({
							startPolylinePointIndex: interval.startPolylinePointIndex,
							endPolylinePointIndex: interval.endPolylinePointIndex,
							speed: interval.speed as Speed,
						})) ?? [],
					tollInfo: {
						estimatedPrice:
							route.travelAdvisory.tollInfo?.estimatedPrice?.map(price => ({
								currencyCode: price.currencyCode,
								units: price.units.toString(),
								nanos: price.nanos,
							})) ?? [],
					},
				})
			}

			const legs = route.legs.map(leg => {
				const legBuilder = new LegEntityBuilder()
					.setDistance(leg.distanceMeters)
					.setDuration(
						Number(leg.duration.seconds),
						Number(leg.staticDuration.seconds)
					)
					.setEndLocation({
						latitude: leg.endLocation.latLng.latitude,
						longitude: leg.endLocation.latLng.longitude,
					})
					.setStartLocation({
						latitude: leg.startLocation.latLng.latitude,
						longitude: leg.startLocation.latLng.longitude,
					})
					.setPolyline(leg.polyline.encodedPolyline)
					.setLocalizedValues({
						distance: leg.localizedValues.distance.text,
						duration: leg.localizedValues.duration.text,
						staticDuration: leg.localizedValues.staticDuration.text,
					})

				const steps = leg.steps.map(step => {
					const stepBuilder = new StepEntityBuilder()
						.setDistance(step.distanceMeters)
						.setDuration(Number(step.staticDuration.seconds))
						.setEndLocation({
							latitude: step.endLocation.latLng.latitude,
							longitude: step.endLocation.latLng.longitude,
						})
						.setStartLocation({
							latitude: step.startLocation.latLng.latitude,
							longitude: step.startLocation.latLng.longitude,
						})
						.setPolyline(step.polyline.encodedPolyline)
						.setLocalizedValues({
							distance: step.localizedValues.distance.text,
							staticDuration: step.localizedValues.staticDuration.text,
						})
						.setNavigationInstruction({
							instructions: step.navigationInstruction?.instructions,
							maneuver: step.navigationInstruction?.maneuver as Maneuver,
						})

					if (step.travelAdvisory) {
						stepBuilder.setTravelAdvisory({
							speedReadingIntervals:
								step.travelAdvisory.speedReadingIntervals?.map(interval => ({
									startPolylinePointIndex: interval.startPolylinePointIndex,
									endPolylinePointIndex: interval.endPolylinePointIndex,
									speed: interval.speed as Speed,
								})) ?? [],
						})
					}

					return stepBuilder.build()
				})

				return legBuilder.setSteps(steps).build()
			})

			routeBuilder.setLegs(legs)

			if (
				criteriaDto.advancedCriteria &&
				criteriaDto.advancedCriteria.interestPoints &&
				criteriaDto.advancedCriteria.interestPoints.length > 0
			) {
				const departureTime = new Date(criteriaDto.basicCriteria.departureTime)

				let startDateTimeWithTraffic = new TZDate(departureTime, TIME_ZONES.AR)

				let startDateTimeWithoutTraffic = new TZDate(
					departureTime,
					TIME_ZONES.AR
				)

				console.log(startDateTimeWithTraffic)

				criteriaDto.advancedCriteria.interestPoints
					.filter(interestPoint => interestPoint.vehicleStopover)
					.forEach(interestPoint => {
						const { duration, staticDuration } = legs.find(leg =>
							isNearby(leg.endLocation, interestPoint.location, 2)
						)

						const stopBuilder = new StopEntityBuilder()
							.setActivities(interestPoint.activities)
							.setPlaceId(interestPoint.placeId)
							.setAddress(interestPoint.address)
							.setLocation(interestPoint.location)
							.setDateTime(
								startDateTimeWithTraffic,
								startDateTimeWithoutTraffic,
								duration,
								staticDuration
							)

						const stop = stopBuilder.build()

						startDateTimeWithTraffic = new TZDate(
							stop.estimatedDepartureDateTimeWithTraffic,
							TIME_ZONES.AR
						)

						startDateTimeWithoutTraffic = new TZDate(
							stop.estimatedDepartureDateTimeWithoutTraffic,
							TIME_ZONES.AR
						)

						routeBuilder.setStop(stop)
					})

				const passages = criteriaDto.advancedCriteria.interestPoints
					.filter(interestPoint => !interestPoint.vehicleStopover)
					.map(interestPoint =>
						new PassageEntityBuilder()
							.setAddress(interestPoint.address)
							.setLocation(interestPoint.location)
							.setPlaceId(interestPoint.placeId)
							.build()
					)

				routeBuilder.setPassages(passages)
			}

			return routeBuilder.build()
		})

		return optimization
	}

	async refineOptimization(criteriaDto: CriteriaDto) {
		const routes = criteriaDto.advancedCriteria
			? await this.computeAdvancedOptimization(criteriaDto)
			: await this.computeBasicOptimization(criteriaDto.basicCriteria)

		if (routes.length > 1) {
			return ''
		}

		const route = routes.at(0)
		const closedStops: Array<{ stop: StopEntity; alternatives: any[] }> = []

		await Promise.all(
			route.stops.map(async stop => {
				const place = await this.places.getPlaceDetails(stop.placeId, [
					'regularOpeningHours',
				])

				const arrivalDate = new Date(stop.estimatedArrivalDateTimeWithTraffic)
				const dayOfWeek = arrivalDate.getUTCDay()
				const arrivalHour = arrivalDate.getUTCHours()
				const arrivalMinutes = arrivalDate.getUTCMinutes()

				const openingPeriods =
					place.regularOpeningHours?.periods.filter(
						period => period.open.day === dayOfWeek
					) || []

				const isOpen = openingPeriods.some(period => {
					return isPlaceOpenAtTime(period, arrivalHour, arrivalMinutes)
				})

				if (!isOpen) {
					console.log(
						`Stop at ${place.id}: Closed on arrival. Finding alternatives...`
					)

					const alternatives = await this.places.nearbySearch(
						stop.location,
						place.types
					)

					closedStops.push({ stop, alternatives })
				} else {
					console.log(`Stop at ${stop.placeId}: Open on arrival.`)
				}
			})
		)

		return { routes, closedStops }
	}

	async optimizeTours(userId: string, settingDto: SettingDto) {
		const fleet = await this.fleets.findOne(
			userId,
			settingDto.firstStage.fleetId
		)

		const driver = await this.drivers.findOne(
			userId,
			settingDto.firstStage.driverId
		)

		const vehicle = await this.vehicles.findOne(
			userId,
			settingDto.firstStage.vehicleId
		)

		const request = new FleetManagementBuilder(
			`Flota: ${fleet.name} - Vehículo: ${vehicle.licensePlate} - Conductor: ${driver.name}`
		)
			.setStartDateTime(settingDto.firstStage.startDateTime)
			.setEndDateTime(settingDto.firstStage.endDateTime)
			.setStartWaypoint(settingDto.firstStage.startWaypoint)
			.setEndWaypoint(settingDto.firstStage.endWaypoint)
			.setDriving()
			.setServices(settingDto.secondStage.services)

		if (settingDto.firstStage.modifiers) {
			request.setModifiers(settingDto.firstStage.modifiers)
		}

		if (settingDto.thirdStage) {
			const costsProfile = this.findCostProfile(
				settingDto.thirdStage.costProfile
			)

			costsProfile && costsProfile.id !== CostProfile.optimized_custom
				? request.setCostModel({
						costPerHour: costsProfile.costPerHour,
						costPerKilometer: costsProfile.costPerKilometer,
						costPerTraveledHour: costsProfile.costPerTraveledHour,
						fixedCost: costsProfile.fixedCost,
						travelDurationMultiple: costsProfile.travelDurationMultiple,
					})
				: request.setCostModel(settingDto.thirdStage.costModel)

			settingDto.thirdStage.bounds &&
				request.setBounds(settingDto.thirdStage.bounds)
		}

		const build = request.build()

		const response = await this.routesOptimization.optimizeTours(build)

		const route = response.routes.at(0)

		const skipped = response.skippedShipments.map(s => s.label)

		if (skipped.length === settingDto.secondStage.services.length) {
			throw new NotFoundException(
				'No se encontró una ruta optima, verifica la duración de los servicios o los límites de la ruta'
			)
		}

		const optimization = new RoadmapOptimizationBuilderEntity()
			.setLabel(route.vehicleLabel)
			.setStartTime(route.vehicleStartTime)
			.setEndTime(route.vehicleEndTime)
			.setPolyline(route.routePolyline)
			.setMetrics(route.metrics, route.routeCosts, route.routeTotalCost)
			.setVisits(route.visits, settingDto.secondStage.services)
			.setTransitions(route.transitions)
			.setSkipped(skipped)
			.build()

		return optimization
	}

	findAllCostProfiles() {
		return Object.values(COST_PROFILES)
	}

	findCostProfile(profile: CostProfile) {
		return COST_PROFILES[profile]
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
