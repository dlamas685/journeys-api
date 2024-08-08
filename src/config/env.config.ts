import * as Joi from 'joi'

const validationSchema = Joi.object({
	PORT: Joi.number().port().default(3000),
	DATABASE_URL: Joi.string().required(),
})

export const envConfig = {
	validationSchema,
	validationOptions: {
		allowUnknown: true,
		abortEarly: true,
	},
}
