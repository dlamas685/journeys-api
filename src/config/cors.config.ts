import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'

export const corsConfig: CorsOptions = {
	credentials: true,
	methods: 'GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS',
	origin: true,
}
