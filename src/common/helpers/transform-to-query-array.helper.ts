export const transformToQueryArray = (value: any) => {
	return typeof value === 'string' ? [value] : value
}
