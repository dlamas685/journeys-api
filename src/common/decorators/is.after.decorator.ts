import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'isAfter', async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {
	validate(endTime: string, args: ValidationArguments) {
		const object = args.object as any
		const startTime = object[args.constraints[0]]

		if (!startTime || !endTime) {
			return false
		}

		return new Date(endTime) > new Date(startTime)
	}

	defaultMessage(args: ValidationArguments) {
		return `${args.property} must be later than ${args.constraints[0]}`
	}
}

export function IsAfter(
	property: string,
	validationOptions?: ValidationOptions
) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [property],
			validator: IsAfterConstraint,
		})
	}
}
