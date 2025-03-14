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
		title: 'Adquirir un plan',
		description:
			'Puedes adquirir un plan para realizar optimizaciones avanzadas y obtener asistencia inteligente personalizada en tus viajes.',
	},
	{
		id: 3,
		title: '¡Listo!',
		description: 'Ya puedes comenzar a crear tus viajes.',
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
			'Para poder comenzar a crear hojas de ruta, necesitamos que completes tu perfil.',
	},
	{
		id: 4,
		title: '¡Listo!',
		description:
			'Ya puedes comenzar a crear tus hojas de ruta y, si lo deseas, ver los detalles de las mismas.',
	},
]

export const PERSONAL_USER_MESSAGE =
	'¡Gracias por unirte a Journeys! Con nuestra plataforma, podrás planificar tus viajes de manera más eficiente según tus necesidades y, si lo deseas, recibir asistencia inteligente.'

export const COMPANY_USER_MESSAGE =
	'¡Gracias por unirte a Journeys! Con nuestra plataforma, podrás planificar tus hojas de ruta y, si lo deseas, monitorear el estado de las mismas.'
