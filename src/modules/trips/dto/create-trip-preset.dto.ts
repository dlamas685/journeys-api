import { JsonValue } from '@prisma/client/runtime/library'
import { IsOptional } from 'class-validator'

// TODO: take definition from front-end
export class CreateTripPresetDto {
	//Remove or add others necessary property
	description?: string
	routeToken?: string
	travelAdvisory?: JsonValue
	polyline?: JsonValue
	polylineDetails?: JsonValue

	@IsOptional()
	coreFeatures?: JsonValue

	@IsOptional()
	advancedFeatures?: JsonValue
}
