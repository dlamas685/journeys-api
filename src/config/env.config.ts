import { ConfigModuleOptions } from '@nestjs/config'
import * as Joi from 'joi'

const validationSchema = Joi.object({
	PORT: Joi.number().port().default(3001),
	DATABASE_URL: Joi.string().required(),
	JWT_SECRET: Joi.string().required(),
	FRONTEND_URL: Joi.string().required(),
	MAIL_HOST: Joi.string().required(),
	MAIL_PORT: Joi.number().port().required(),
	MAIL_USER: Joi.string().required(),
	MAIL_PASSWORD: Joi.string().required(),
	MAIL_FROM: Joi.string().required(),
	GOOGLE_CLIENT_ID: Joi.string().required(),
	GOOGLE_CLIENT_SECRET: Joi.string().required(),
	GOOGLE_CALLBACK_URL: Joi.string().required(),
	CLOUDINARY_NAME: Joi.string().required(),
	CLOUDINARY_API_KEY: Joi.string().required(),
	CLOUDINARY_API_SECRET: Joi.string().required(),
	GOOGLE_MAPS_API_KEY: Joi.string().required(),
	SALTS: Joi.number().default(10),
})

export const envConfig: ConfigModuleOptions = {
	isGlobal: true,
	validationSchema,
	validationOptions: {
		allowUnknown: true,
		abortEarly: true,
	},
}
