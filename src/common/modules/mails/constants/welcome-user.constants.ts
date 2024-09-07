import { WelcomeStep } from '../interfaces'

export const PERSONAL_USER_STEPS: WelcomeStep[] = [
	{
		id: 1,
		title: 'Verifica tu correo electrónico',
		description:
			'Para poder usar todas las funcionalidades, necesitamos que verifiques tu correo electrónico.',
	},
	{
		id: 2,
		title: 'Completa tu perfil',
		description:
			'Para poder ofrecer tus servicios de entrega, necesitamos que completes tu perfil.',
	},
	{
		id: 3,
		title: 'Adquirir un plan',
		description:
			'Puedes adquirir un plan para realizar optimizaciones avanzadas en tus viajes.',
	},
	{
		id: 4,
		title: '¡Listo!',
		description:
			'Ya puedes comenzar a planificar tus viajes y, si lo deseas, ofrecer tus servicios de entrega.',
	},
]

export const COMPANY_USER_STEPS: WelcomeStep[] = [
	{
		id: 1,
		title: 'Verifica tu correo electrónico',
		description:
			'Para poder pagar la suscripción, necesitamos que verifiques tu correo electrónico.',
	},
	{
		id: 2,
		title: 'Paga tu suscripción',
		description:
			'Para poder usar todas las funcionalidades, necesitamos que pagues tu suscripción.',
	},
	{
		id: 3,
		title: 'Completa tu perfil',
		description:
			'Para poder comenzar a planificar tus hojas de ruta, necesitamos que completes tu perfil.',
	},
	{
		id: 4,
		title: '¡Listo!',
		description:
			'Ya puedes comenzar a planificar tus hojas de ruta y, si lo deseas, monitorear en tiempo real el estado de las mismas.',
	},
]

export const PERSONAL_USER_MESSAGE =
	'¡Gracias por unirte a Journeys! Con nuestra plataforma, podrás planificar tus viajes de manera más eficiente según tus necesidades y, si lo deseas, obtener ingresos adicionales.'

export const COMPANY_USER_MESSAGE =
	'¡Gracias por unirte a Journeys! Con nuestra plataforma, podrás planificar tus hojas de ruta para tus conductores y, si lo deseas, monitorear en tiempo real el estado de las mismas.'
