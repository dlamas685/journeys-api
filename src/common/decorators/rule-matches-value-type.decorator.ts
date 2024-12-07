import {
	isArray,
	isBoolean,
	isDate,
	isNumber,
	isString,
	isUUID,
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
	VALID_UUID_RULES,
} from '../constants'
import { FilterRules } from '../enums'

@ValidatorConstraint({ async: false })
export class RuleMatchesValueTypeConstraint
	implements ValidatorConstraintInterface
{
	validate(rule: FilterRules, args: ValidationArguments) {
		const value = (args.object as any).value

		if (isUUID(value) && VALID_UUID_RULES.includes(rule)) {
			return true
		}

		if (isDate(value) && VALID_DATE_RULES.includes(rule)) {
			return true
		}

		if (isNumber(value) && VALID_NUMBER_RULES.includes(rule)) {
			return true
		}

		if (isArray(value) && VALID_ARRAY_RULES.includes(rule)) {
			return true
		}

		if (isBoolean(value) && rule === FilterRules.EQUALS) {
			return true
		}

		if (isString(value) && VALID_STRING_RULES.includes(rule)) {
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
