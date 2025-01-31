import { protos } from '@googlemaps/routeoptimization'
import { getUnixTime } from 'date-fns/getUnixTime'
import { parseISO } from 'date-fns/parseISO'
import {
	CostModelDto,
	ModifiersDto,
	WaypointDto,
} from 'src/modules/optimization/routes-optimization/dto'
import { ServiceDto } from '../routes-optimization/dto/service.dto'

export class FleetManagementBuilder {
	private request: protos.google.maps.routeoptimization.v1.OptimizeToursRequest

	constructor(private name: string) {
		this.request =
			new protos.google.maps.routeoptimization.v1.OptimizeToursRequest()

		this.request.model =
			new protos.google.maps.routeoptimization.v1.ShipmentModel()

		this.request.model.globalStartTime = new protos.google.protobuf.Timestamp()

		this.request.model.globalEndTime = new protos.google.protobuf.Timestamp()

		this.request.model.vehicles = []

		this.request.model.shipments = []
	}

	private ensureVehicleExists() {
		if (!this.request.model.vehicles) {
			this.request.model.vehicles = []
		}

		if (this.request.model.vehicles.length === 0) {
			this.request.model.vehicles.push({
				displayName: this.name,
				startWaypoint: undefined,
				endWaypoint: undefined,
				fixedCost: 0,
				costPerHour: 0,
				costPerKilometer: 0,
				costPerTraveledHour: 0,
				travelDurationMultiple: 1,
				routeModifiers:
					new protos.google.maps.routeoptimization.v1.RouteModifiers(),
			})
		}
	}

	setEndTime(endTime: string) {
		this.request.model.globalEndTime.nanos = 0
		this.request.model.globalEndTime.seconds = getUnixTime(parseISO(endTime))
		return this
	}

	setStartTime(startTime: string) {
		this.request.model.globalStartTime.nanos = 0
		this.request.model.globalStartTime.seconds = getUnixTime(
			parseISO(startTime)
		)
		return this
	}

	setStartWaypoint(startWaypoint: WaypointDto) {
		this.ensureVehicleExists()
		this.request.model.vehicles[0].startWaypoint = {
			placeId: startWaypoint.placeId,
			sideOfRoad: true,
		}
		return this
	}

	setEndWaypoint(endWaypoint: WaypointDto) {
		this.ensureVehicleExists()
		this.request.model.vehicles[0].endWaypoint = {
			placeId: endWaypoint.placeId,
			sideOfRoad: true,
		}
		return this
	}

	setCostModel(costModel?: CostModelDto) {
		this.ensureVehicleExists()
		const vehicle = this.request.model.vehicles[0]
		vehicle.fixedCost = costModel?.fixedCost
		vehicle.costPerHour = costModel?.costPerHour
		vehicle.costPerKilometer = costModel?.costPerKilometer
		vehicle.costPerTraveledHour = costModel?.costPerTraveledHour
		vehicle.travelDurationMultiple = costModel?.travelDurationMultiple
		return this
	}

	setModifiers(modifiers?: ModifiersDto) {
		this.ensureVehicleExists()
		const vehicle = this.request.model.vehicles[0]

		vehicle.routeModifiers.avoidFerries = modifiers?.avoidFerries
		vehicle.routeModifiers.avoidHighways = modifiers?.avoidHighways
		vehicle.routeModifiers.avoidTolls = modifiers?.avoidTolls
		this.request.considerRoadTraffic = modifiers?.considerRoadTraffic

		return this
	}

	setDriving() {
		this.ensureVehicleExists()
		const vehicle = this.request.model.vehicles[0]
		vehicle.travelMode = 'DRIVING'
		return this
	}

	setWalking() {
		this.ensureVehicleExists()
		const vehicle = this.request.model.vehicles[0]
		vehicle.travelMode = 'WALKING'
		return this
	}

	setServices(services: ServiceDto[]) {
		services.forEach(service => {
			this.request.model.shipments.push({
				deliveries: [
					{
						label: service.name,
						arrivalWaypoint: {
							placeId: service.waypoint.placeId,
							sideOfRoad: true,
						},
						duration: {
							nanos: 0,
							seconds: service.duration,
						},
					},
				],
				label: service.id,
				displayName: service.id,
			})
		})

		return this
	}

	build() {
		return this.request
	}
}
