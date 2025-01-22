import {
	protos,
	RouteOptimizationClient,
	v1,
} from '@googlemaps/routeoptimization'
import {
	BadRequestException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RouteOptimizationService {
	private client: RouteOptimizationClient
	private logger: Logger = new Logger(RouteOptimizationService.name)
	private projectId: string = ''

	constructor(private readonly config: ConfigService) {
		this.client = new v1.RouteOptimizationClient()
		this.projectId = this.config.get<string>('GOOGLE_PROJECT_ID')
	}

	async optimizeTours(
		request: protos.google.maps.routeoptimization.v1.IOptimizeToursRequest
	) {
		try {
			const [result] = await this.client.optimizeTours({
				parent: `projects/${this.projectId}`,
				populatePolylines: true,
				populateTransitionPolylines: true,
				...request,
			})

			return result
		} catch (error) {
			this.logger.error(
				`Error optimizing route for request: ${JSON.stringify(error)}`
			)

			if (error.code === HttpStatus.BAD_REQUEST) {
				throw new BadRequestException(`Invalid request: ${error.message}`)
			}

			if (error.code === HttpStatus.FORBIDDEN) {
				throw new BadRequestException(
					`The request is missing a valid API key: ${error.message}`
				)
			}

			throw new InternalServerErrorException(
				`An error occurred while processing the request: ${error.message}`
			)
		}
	}
}
