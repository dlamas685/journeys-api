import { protos } from '@googlemaps/routing'
import { getUnixTime } from 'date-fns/getUnixTime'
import { parseISO } from 'date-fns/parseISO'
import { ModifiersDto, WaypointDto } from 'src/modules/optimization/routes/dto'
import {
	ExtraComputation,
	ReferenceRoute,
	TollPass,
	TrafficModel,
	TrafficOption,
	TravelMode,
	VehicleEmissionType,
} from 'src/modules/optimization/routes/enums'

export class ComputeRoutesRequestBuilder {
	private request: protos.google.maps.routing.v2.ComputeRoutesRequest

	constructor() {
		this.request = new protos.google.maps.routing.v2.ComputeRoutesRequest()

		this.request.origin = new protos.google.maps.routing.v2.Waypoint()

		this.request.destination = new protos.google.maps.routing.v2.Waypoint()

		this.request.departureTime = new protos.google.protobuf.Timestamp()

		this.request.intermediates = []

		this.request.routeModifiers =
			new protos.google.maps.routing.v2.RouteModifiers()

		this.request.routeModifiers.vehicleInfo =
			new protos.google.maps.routing.v2.VehicleInfo()
	}

	setOrigin(origin: WaypointDto) {
		this.request.origin.placeId = origin.placeId
		this.request.origin.sideOfRoad = true
		return this
	}

	setDestination(destination: WaypointDto) {
		this.request.destination.placeId = destination.placeId
		this.request.destination.sideOfRoad = true
		return this
	}

	setInterestPoints(interestPoints: WaypointDto[]) {
		this.request.intermediates = interestPoints.map(
			({ placeId, sideOfRoad, vehicleStopover, via }) => ({
				placeId,
				sideOfRoad,
				vehicleStopover,
				via,
			})
		)

		return this
	}

	setInterestPoint(interestPoint: WaypointDto) {
		this.request.intermediates.push({
			placeId: interestPoint.placeId,
			sideOfRoad: interestPoint.sideOfRoad,
			vehicleStopover: interestPoint.vehicleStopover,
			via: interestPoint.via,
		})

		return this
	}

	setTravelMode(travelMode: TravelMode) {
		this.request.travelMode = travelMode
		return this
	}

	setDepartureTime(departureTime: string) {
		this.request.departureTime.seconds = getUnixTime(parseISO(departureTime))
		return this
	}

	setTrafficOption(trafficOption: TrafficOption) {
		this.request.routingPreference = trafficOption

		if (trafficOption === TrafficOption.TRAFFIC_UNAWARE) {
			this.request.departureTime = undefined
		}

		return this
	}

	setModifiers(modifiers: ModifiersDto) {
		this.request.routeModifiers = {
			...this.request.routeModifiers,
			...modifiers,
		}
		return this
	}

	setExtraComputations(extraComputations: ExtraComputation[]) {
		this.request.extraComputations = extraComputations

		if (extraComputations.includes(ExtraComputation.TOLLS)) {
			this.request.routeModifiers.tollPasses = [TollPass.AR_TELEPASE]
		}

		return this
	}

	setRequestedReferenceRoutes(requestedReferenceRoutes: ReferenceRoute[]) {
		this.request.requestedReferenceRoutes = requestedReferenceRoutes
		return this
	}

	setTrafficModel(trafficModel: TrafficModel) {
		this.request.trafficModel = trafficModel
		return this
	}

	setComputeAlternativeRoutes(computeAlternativeRoutes: boolean) {
		this.request.computeAlternativeRoutes = computeAlternativeRoutes
		return this
	}

	setOptimizeWaypointOrder(optimizeWaypointOrder: boolean) {
		this.request.optimizeWaypointOrder = optimizeWaypointOrder
		return this
	}

	setEmissionType(emissionType: VehicleEmissionType) {
		this.request.routeModifiers.vehicleInfo.emissionType = emissionType
		return this
	}

	build() {
		return this.request
	}
}
