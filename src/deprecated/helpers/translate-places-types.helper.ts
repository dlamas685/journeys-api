import { PLACE_TYPE_TRANSLATIONS } from './place-type-translations.constants'

export function translatePlacesTypes(types: string[]): string[] {
	return types.map(type => PLACE_TYPE_TRANSLATIONS[type] || type)
}
