export function replaceEmpty(str: string | undefined, replacement = '') {
	return !str || 0 === str.length ? replacement : str;
}
export function staticImplements<T>() {
	return <U extends T>(constructor: U) => constructor;
}
