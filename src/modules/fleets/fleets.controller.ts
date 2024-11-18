import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UserId } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateFleetDto } from './dto/create-fleet.dto'
import { UpdateFleetDto } from './dto/update-fleet.dto'
import { FleetEntity } from './entities/fleet.entity'
import { FleetsService } from './fleets.service'

@Controller('fleets')
@UseGuards(JwtAuthGuard)
@ApiTags('Fleets')
@ApiBearerAuth('JWT-auth')
export class FleetsController {
	constructor(private readonly fleetsService: FleetsService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOkResponse({ type: FleetEntity })
	create(@UserId() userId: string, @Body() createFleetDto: CreateFleetDto) {
		return this.fleetsService.create(userId, createFleetDto)
	}

	@Get()
	@ApiOkResponse({ type: [FleetEntity] })
	findAll(@UserId() userId: string) {
		return this.fleetsService.findAll(userId)
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: FleetEntity })
	findOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.fleetsService.findOne(userId, id)
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: FleetEntity })
	update(
		@UserId() userId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateFleetDto: UpdateFleetDto
	) {
		return this.fleetsService.update(userId, id, updateFleetDto)
	}

	@Delete(':id')
	remove(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
		return this.fleetsService.remove(userId, id)
	}
}
