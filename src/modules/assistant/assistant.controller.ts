import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserId } from 'src/common/decorators'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AssistantService } from './assistant.service'
import { CreateRealTimeSessionDto } from './dtos/create-real-time-session.dto'

@UseGuards(JwtAuthGuard)
@ApiTags('Assistant')
@ApiBearerAuth('JWT-auth')
@Controller('assistant')
export class AssistantController {
	constructor(private readonly assistant: AssistantService) {}

	@Post('session')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Creación de session en OpenAI RealTime',
		description:
			'Permite crear una nueva sesión en OpenAI RealTime para interactuar con el asistente.',
	})
	async createSession(
		@UserId() userId: string,
		@Body() sessionDto: CreateRealTimeSessionDto
	) {
		return await this.assistant.createSession(userId, sessionDto)
	}
}
