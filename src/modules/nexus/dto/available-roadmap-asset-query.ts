import { IsDateString } from 'class-validator'

export class AvailableRoadmapAssetQueryParamsDto {
	@IsDateString()
	fromDate: Date

	@IsDateString()
	toDate: Date
}
