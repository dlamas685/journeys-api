import { protos } from '@googlemaps/routeoptimization'
import { ApiProperty } from '@nestjs/swagger'
import { formatISO } from 'date-fns/formatISO'
import { fromUnixTime } from 'date-fns/fromUnixTime'
import { ServiceDto } from '../dto'
import { MetricsEntity } from './metrics.entity'
import { TransitionEntity } from './transition.entity'
import { VisitEntity } from './visit.entity'

export class RoadmapsOptimizationEntity {
	@ApiProperty()
	label: string

	@ApiProperty()
	startTime: string

	@ApiProperty()
	endTime: string

	@ApiProperty()
	encodedPolyline: string

	@ApiProperty({ type: VisitEntity, isArray: true })
	visits: VisitEntity[]

	@ApiProperty({ type: TransitionEntity, isArray: true })
	transitions: TransitionEntity[]

	@ApiProperty({ type: MetricsEntity })
	metrics: MetricsEntity

	@ApiProperty()
	skipped: string[]

	constructor() {
		this.visits = []
		this.transitions = []
		this.metrics = new MetricsEntity()
	}
}

export class RoadmapsOptimizationBuilderEntity {
	private roadmaps: RoadmapsOptimizationEntity

	constructor() {
		this.roadmaps = new RoadmapsOptimizationEntity()
	}

	setLabel(label: string) {
		this.roadmaps.label = label
		return this
	}

	setStartTime(startTime: protos.google.protobuf.ITimestamp) {
		this.roadmaps.startTime = formatISO(fromUnixTime(Number(startTime.seconds)))
		return this
	}

	setEndTime(endTime: protos.google.protobuf.ITimestamp) {
		this.roadmaps.endTime = formatISO(fromUnixTime(Number(endTime.seconds)))
		return this
	}

	setPolyline(
		routePolyline: protos.google.maps.routeoptimization.v1.ShipmentRoute.IEncodedPolyline
	) {
		this.roadmaps.encodedPolyline = routePolyline.points
		return this
	}

	setVisits(
		visits: protos.google.maps.routeoptimization.v1.ShipmentRoute.IVisit[],
		services: ServiceDto[]
	) {
		this.roadmaps.visits = visits.map(visit => {
			const service = services.find(
				service => service.id === visit.shipmentLabel
			)

			return {
				visitId: visit.shipmentLabel,
				visitName: visit.visitLabel,
				visitDescription: service?.description,
				visitDuration: Number(service?.duration),
				startTime: formatISO(fromUnixTime(Number(visit.startTime.seconds))),
				detour: Number(visit.detour.seconds),
			}
		})

		return this
	}

	setTransitions(
		transitions: protos.google.maps.routeoptimization.v1.ShipmentRoute.ITransition[]
	) {
		this.roadmaps.transitions = transitions.map(transition => ({
			startTime: formatISO(fromUnixTime(Number(transition.startTime.seconds))),
			travelDistanceMeters: transition.travelDistanceMeters,
			travelDuration: Number(transition.travelDuration.seconds),
			totalDuration: Number(transition.totalDuration.seconds),
			encodedPolyline: transition.routePolyline?.points,
			token: transition.routeToken,
		}))

		return this
	}

	setMetrics(
		metrics: protos.google.maps.routeoptimization.v1.IAggregatedMetrics,
		routeCosts: { [k: string]: number },
		routeTotalCost: number
	) {
		this.roadmaps.metrics = {
			performedServiceCount: metrics.performedShipmentCount,
			travelDuration: Number(metrics.travelDuration.seconds),
			visitDuration: Number(metrics.visitDuration.seconds),
			travelDistanceMeters: metrics.travelDistanceMeters,
			totalFixedCost: routeCosts['model.vehicles.fixed_cost'],
			totalCostPerHour: routeCosts['model.vehicles.cost_per_hour'],
			totalCostPerKilometer: routeCosts['model.vehicles.cost_per_kilometer'],
			totalCostPerTraveledHour:
				routeCosts['model.vehicles.cost_per_traveled_hour'],
			totalCost: routeTotalCost,
		}

		return this
	}

	setSkipped(skipped: string[]) {
		this.roadmaps.skipped = skipped
		return this
	}

	build() {
		return this.roadmaps
	}
}
