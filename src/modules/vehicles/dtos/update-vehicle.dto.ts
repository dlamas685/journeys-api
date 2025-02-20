import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { CreateVehicleDto } from './create-vehicle.dto'

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
	@IsOptional()
	@IsString()
	@ApiPropertyOptional()
	imageUrl: string | null
}
