import { PLACE_TYPES_TRANSLATIONS } from '../constants/place-type-translations.constants'

export function translatePlacesType(types: string[]): string[] {
	return types.map(type => PLACE_TYPES_TRANSLATIONS[type] || type)
}
