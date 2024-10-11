export const transformToQueryArray = ({ value }) =>
	typeof value === 'string' ? value.split(',') : value
