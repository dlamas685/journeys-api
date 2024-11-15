import { PLACE_TYPE_TRANSLATIONS } from '../constants/place-type-translations.constants'

export function translatePlaceTypes(types: string[]): string[] {
	return types.map(type => PLACE_TYPE_TRANSLATIONS[type] || type)
}
