import { ConfigModuleOptions } from '@nestjs/config'
import * as Joi from 'joi'

const validationSchema = Joi.object({
	PORT: Joi.number().port().default(3001),
	DATABASE_URL: Joi.string().required(),
	JWT_SECRET: Joi.string().required(),
})

export const envConfig: ConfigModuleOptions = {
	isGlobal: true,
	validationSchema,
	validationOptions: {
		allowUnknown: true,
		abortEarly: true,
	},
}
