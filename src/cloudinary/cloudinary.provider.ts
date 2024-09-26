import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'

export const CloudinaryProvider = {
	provide: 'CLOUDINARY',
	inject: [ConfigService],
	useFactory: (config: ConfigService) => {
		return cloudinary.config({
			cloud_name: config.get<string>('CLOUDINARY_NAME'),
			api_key: config.get<string>('CLOUDINARY_API_KEY'),
			api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
		})
	},
}
