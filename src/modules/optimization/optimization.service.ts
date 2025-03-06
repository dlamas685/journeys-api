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
import { isNearby } from './helpers'
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
				.setPassages(
					basicCriteria.interestPoints.map(interestPoint =>
						new PassageEntityBuilder()
							.setName(interestPoint.name)
							.setAddress(interestPoint.address)
							.setLocation(interestPoint.location)
							.setPlaceId(interestPoint.placeId)
							.build()
					)
				)
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
					console.log(step.navigationInstruction?.maneuver)

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

					console.log(stepBuilder.build())

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

				criteriaDto.advancedCriteria.interestPoints
					.filter(interestPoint => interestPoint.vehicleStopover)
					.forEach(interestPoint => {
						const { duration, staticDuration } = legs.find(leg =>
							isNearby(leg.endLocation, interestPoint.location, 2)
						)

						const stopBuilder = new StopEntityBuilder()
							.setName(interestPoint.name)
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
