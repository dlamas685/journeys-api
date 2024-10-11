import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator'
import {
	VALID_ARRAY_RULES,
	VALID_DATE_RULES,
	VALID_NUMBER_RULES,
	VALID_STRING_RULES,
} from '../constants'
import { FilterRules } from '../enums'

@ValidatorConstraint({ async: false })
export class RuleMatchesValueTypeConstraint
	implements ValidatorConstraintInterface
{
	validate(rule: FilterRules, args: ValidationArguments) {
		const value = (args.object as any).value

		if (value instanceof Date && VALID_DATE_RULES.includes(rule)) {
			return true
		}

		if (typeof value === 'number' && VALID_NUMBER_RULES.includes(rule)) {
			return true
		}

		if (value instanceof Array && VALID_ARRAY_RULES.includes(rule)) {
			return true
		}

		if (typeof value === 'boolean' && rule === FilterRules.EQUALS) {
			return true
		}

		if (typeof value === 'string' && VALID_STRING_RULES.includes(rule)) {
			console.log('string')
			return true
		}

		return false
	}

	defaultMessage(args: ValidationArguments) {
		const value = (args.object as any).value
		return `La regla '${args.value}' no es válida para el tipo de valor '${typeof value}'.`
	}
}

export const RuleMatchesValueType = (validationOptions?: ValidationOptions) => {
	return (object: object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: RuleMatchesValueTypeConstraint,
		})
	}
}
