import { CostProfileEntity } from '../entities/cost-profile.entity'
import { CostProfile } from '../enums/cost-profile.enum'

export const COST_PROFILES: Record<CostProfile, CostProfileEntity> = {
	optimized_distance: {
		id: CostProfile.optimized_distance,
		name: 'Optimización de distancia',
		description:
			'Minimiza la distancia recorrida para reducir costos de transporte y maximizar la eficiencia en el traslado entre domicilios.',
		costPerKilometer: 150,
		costPerHour: 75,
		costPerTraveledHour: 50,
		fixedCost: 10,
		travelDurationMultiple: 1.2,
	},
	optimized_balance: {
		id: CostProfile.optimized_balance,
		name: 'Optimización equilibrada',
		description:
			'Balancea la distancia y el tiempo total de cada servicio, garantizando un uso eficiente del tiempo sin afectar la planificación de visitas.',
		costPerKilometer: 100,
		costPerHour: 100,
		costPerTraveledHour: 50,
		fixedCost: 20,
		travelDurationMultiple: 1,
	},
	optimized_time: {
		id: CostProfile.optimized_time,
		name: 'Optimización de tiempo',
		description:
			'Minimiza el tiempo total de desplazamiento para priorizar la rapidez en la atención de cada servicio, incluso si se recorren más kilómetros.',
		costPerKilometer: 75,
		costPerHour: 150,
		costPerTraveledHour: 125,
		fixedCost: 30,
		travelDurationMultiple: 0.8,
	},
	optimized_custom: {
		id: CostProfile.optimized_custom,
		name: 'Optimización personalizada',
		description:
			'Configura manualmente los costos para ajustar el modelo de optimización a tus necesidades específicas.',
		costPerKilometer: 0,
		costPerHour: 0,
		costPerTraveledHour: 0,
		fixedCost: 0,
		travelDurationMultiple: 1,
	},
}
