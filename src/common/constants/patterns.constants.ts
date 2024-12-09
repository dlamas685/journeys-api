export const PASSWORD_PATTERN: string =
	'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])[A-Za-z\\d\\W_]{8,}$'

export const LICENSE_PLATE_PATTERN: RegExp =
	/^[A-Z]{3} ?\d{3}$|^[A-Z]{2} ?\d{3} ?[A-Z]{2}$/

export const VIN_PATTERN: RegExp = /^[A-HJ-NPR-Z0-9]{17}$/
