import { Injectable, NotFoundException } from '@nestjs/common'
import { DriversService } from '../drivers/drivers.service'
import { FleetsService } from '../fleets/fleets.service'
import { RouteOptimizationService } from '../google-maps/services/route-optimization.service'
import { RoutesService } from '../google-maps/services/routes.service'
import { VehiclesService } from '../vehicles/vehicles.service'
import { FleetManagementBuilder, TravelPlanningBuilder } from './classes'
import { COST_PROFILES } from './routes-optimization/constants/cost-profiles.constant'
import { SettingDto } from './routes-optimization/dto'
import { RoadmapOptimizationBuilderEntity } from './routes-optimization/entities'
import { CostProfile } from './routes-optimization/enums/cost-profile.enum'
import { BasicCriteriaDto, CriteriaDto } from './routes/dto'
import { RouteEntityBuilder } from './routes/entities'

@Injectable()
export class OptimizationService {
	constructor(
		private readonly routes: RoutesService,
		private readonly routesOptimization: RouteOptimizationService,
		private readonly fleets: FleetsService,
		private readonly drivers: DriversService,
		private readonly vehicles: VehiclesService
	) {}

	async computeBasicOptimization(basicCriteria: BasicCriteriaDto) {
		const request = new TravelPlanningBuilder()
			.setOrigin(basicCriteria.origin)
			.setDestination(basicCriteria.destination)
			.setDepartureTime(basicCriteria.departureTime)
			.setInterestPoints(basicCriteria.interestPoints)
			.setTravelMode(basicCriteria.travelMode)
			.setTrafficOption(basicCriteria.trafficOption)

		if (basicCriteria.modifiers) {
			request.setModifiers(basicCriteria.modifiers)
		}

		const build = request.build()

		const response = await this.routes.computeBasicRoute(build)

		const defaultRoute = response.routes.at(0)

		const optimization = new RouteEntityBuilder()
			.setDistance(defaultRoute.distanceMeters)
			.setDuration(defaultRoute.duration, defaultRoute.staticDuration)
			.setPolyline(defaultRoute.polyline.encodedPolyline)
			.setLocalizedValues(defaultRoute.localizedValues)
			.setPassages(basicCriteria.interestPoints)
			.build()

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

		if (criteriaDto.advancedCriteria) {
			request.setEmissionType(criteriaDto.advancedCriteria.emissionType)
			request.setInterestPoints(criteriaDto.advancedCriteria.interestPoints)
		}

		const build = request.build()

		const response = await this.routes.computeAdvancedRoute(build)

		const optimization = response.routes.map(route => {
			const routeBuilder = new RouteEntityBuilder()
				.setDistance(route.distanceMeters)
				.setDuration(route.duration, route.staticDuration)
				.setPolyline(route.polyline.encodedPolyline)
				.setLabels(route.routeLabels)
				.setTravelAdvisory(route.travelAdvisory)
				.setLocalizedValues(route.localizedValues)
				.setLegs(route.legs)

			if (
				criteriaDto.advancedCriteria.interestPoints &&
				criteriaDto.advancedCriteria.interestPoints.length > 0
			) {
				routeBuilder.setStops(criteriaDto.advancedCriteria.interestPoints)
				routeBuilder.setPassages(criteriaDto.advancedCriteria.interestPoints)
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
