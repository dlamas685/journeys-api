export const transformToQueryArray = (value: any) =>
	typeof value === 'string' ? value.split(',') : value
